// Raw WebGL port of the old three.js scene: a wireframe and a point cloud of public/skull.bin
// (built by scripts/skull.mjs), lit by a point light that follows the pointer, in linear fog.
const INTRO_ZOOM = 5; // starts this many times larger, eases down to 1
const POINT_SIZE = 0.02; // world units
const WIRE_OPACITY = 0.3; // three drew shared edges twice at 0.2; edges are now deduplicated
const CAMERA_Z = 6;
const FOV = (75 * Math.PI) / 180;
const FOG = [0.045, 0.045, 0.11]; // #3c3c5d in linear space, mixed after sRGB encoding as three does
const FOG_FAR = 25;

const SCATTER_RADIUS = 0.6; // world units around the pointer ray
const SCATTER_FORCE = 0.04;
const SCATTER_RETURN = 0.92; // per-frame decay of the offset, lower snaps back faster

const canvas = document.querySelector<HTMLCanvasElement>('#skull')!;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const gl = canvas.getContext('webgl', { antialias: true })!;

const vertex = `
attribute vec3 position, normal;
uniform mat3 model;
uniform vec3 light;
uniform float aspect, pointScale;
varying vec3 color;
varying float fogDepth;
const float F = ${(1 / Math.tan(FOV / 2)).toFixed(6)};
vec3 srgb(vec3 c) { return mix(pow(c, vec3(0.41666)) * 1.055 - 0.055, c * 12.92, vec3(lessThanEqual(c, vec3(0.0031308)))); }
void main() {
    vec3 world = model * position;
    vec3 view = world - vec3(0.0, 0.0, ${CAMERA_Z.toFixed(1)});
    gl_Position = vec4(view.x * F / aspect, view.y * F, (view.z * 100.1 + 20.0) / -99.9, -view.z);
    gl_PointSize = pointScale / -view.z;
    fogDepth = -view.z;
    // Lambert diffuse from a 4π point light with distance 10 and decay 2, as three's MeshPhongMaterial.
    vec3 toLight = light - world;
    float d = length(toLight);
    float falloff = pow(clamp(1.0 - pow(d / 10.0, 4.0), 0.0, 1.0), 2.0) / max(d * d, 0.01);
    float lambert = max(dot(normalize(model * normal), toLight / d), 0.0);
    color = pointScale > 0.0 ? vec3(1.0) : srgb(vec3(4.0 * lambert * falloff));
}`;
const fragment = `
precision mediump float;
uniform float opacity;
varying vec3 color;
varying float fogDepth;
void main() {
    gl_FragColor = vec4(mix(color, vec3(${FOG.join(', ')}), smoothstep(0.0, ${FOG_FAR.toFixed(1)}, fogDepth)), opacity);
}`;

const program = gl.createProgram()!;
for (const [type, source] of [
    [gl.VERTEX_SHADER, vertex],
    [gl.FRAGMENT_SHADER, fragment]
] as const) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
}
gl.linkProgram(program);
gl.useProgram(program);
const u = (name: string) => gl.getUniformLocation(program, name);
const [uModel, uLight, uAspect, uPointScale, uOpacity] = ['model', 'light', 'aspect', 'pointScale', 'opacity'].map(u);

gl.enable(gl.DEPTH_TEST);
gl.enable(gl.BLEND);
gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

const mouse = [0, 0];
const gaze = [0, 0];
let pointerActive = false;
if (!reducedMotion) {
    addEventListener('pointermove', (e) => {
        mouse[0] = (e.clientX / innerWidth) * 2 - 1;
        mouse[1] = -(e.clientY / innerHeight) * 2 + 1;
        pointerActive = true;
    });
    document.addEventListener('pointerleave', () => (pointerActive = false));
}

let aspect = 1;
let renderFrame: ((now: number) => void) | undefined;
function resize() {
    const dpr = Math.min(devicePixelRatio, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
    aspect = canvas.clientWidth / canvas.clientHeight;
    if (reducedMotion) renderFrame?.(performance.now());
}
new ResizeObserver(resize).observe(canvas);

// The skull's rotation is three's Object3D.lookAt: +Z towards (gaze, 1), +Y kept up.
function lookAt(x: number, y: number) {
    const zl = Math.hypot(x, y, 1);
    const z = [x / zl, y / zl, 1 / zl];
    const xl = Math.hypot(z[2], z[0]);
    const xa = [z[2] / xl, 0, -z[0] / xl];
    const ya = [z[1] * xa[2], z[2] * xa[0] - z[0] * xa[2], -z[1] * xa[0]];
    return [...xa, ...ya, ...z]; // column-major mat3
}

fetch('/skull.bin')
    .then((r) => r.arrayBuffer())
    .then((buf) => {
        const count = new Uint32Array(buf, 0, 1)[0];
        const rest = Float32Array.from(new Int16Array(buf, 4, count * 3), (x) => x / 8192);
        const normals = new Int8Array(buf, 4 + 6 * count, count * 3);
        const edges = new Uint16Array(buf, 4 + 9 * count + (count % 2));
        const positions = rest.slice();
        const offset = new Float32Array(rest.length);
        const jitter = Float32Array.from({ length: count }, () => 0.5 + Math.random());

        const attribute = (name: string, data: ArrayBufferView, type: number, normalized: boolean) => {
            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
            const loc = gl.getAttribLocation(program, name);
            gl.enableVertexAttribArray(loc);
            gl.vertexAttribPointer(loc, 3, type, normalized, 0, 0);
        };
        attribute('normal', normals, gl.BYTE, true);
        attribute('position', positions, gl.FLOAT, false); // left bound for the per-frame scatter upload
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, edges, gl.STATIC_DRAW);

        // Vertices near the pointer ray get pushed away from it, then ease back to rest.
        // Works in model space: the ray is rotated by the transpose of the rotation and divided by the scale.
        function scatter(r: number[], scale: number) {
            const t = Math.tan(FOV / 2);
            let [dx, dy, dz] = [mouse[0] * t * aspect, mouse[1] * t, -1];
            const dl = Math.hypot(dx, dy, dz);
            const dir = [0, 1, 2].map((i) => (r[i * 3] * dx + r[i * 3 + 1] * dy + r[i * 3 + 2] * dz) / dl);
            const origin = [0, 1, 2].map((i) => (r[i * 3 + 2] * CAMERA_Z) / scale);
            const radius = SCATTER_RADIUS / scale;
            for (let i = 0; i < rest.length; i += 3) {
                if (pointerActive) {
                    const v = [rest[i] - origin[0], rest[i + 1] - origin[1], rest[i + 2] - origin[2]];
                    const along = v[0] * dir[0] + v[1] * dir[1] + v[2] * dir[2];
                    const away = v.map((x, k) => x - Math.max(along, 0) * dir[k]);
                    const d = Math.hypot(...away);
                    if (d < radius && d > 0) {
                        const push = ((1 - d / radius) * SCATTER_FORCE * radius * jitter[i / 3]) / d;
                        for (let k = 0; k < 3; k++) offset[i + k] += away[k] * push;
                    }
                }
                for (let k = i; k < i + 3; k++) {
                    offset[k] *= SCATTER_RETURN;
                    positions[k] = rest[k] + offset[k];
                }
            }
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);
        }

        const start = performance.now();
        renderFrame = (now) => {
            const t = reducedMotion ? Infinity : (now - start) / 1000;
            const scale = 1 + (INTRO_ZOOM - 1) * Math.pow(2, -10 * Math.min(t / 6, 1));
            gaze[0] += (mouse[0] - gaze[0]) * 0.05;
            gaze[1] += (mouse[1] - gaze[1]) * 0.05;
            const r = lookAt(gaze[0], gaze[1]);
            if (!reducedMotion) scatter(r, scale);

            const viewHeight = 2 * Math.tan(FOV / 2) * CAMERA_Z;
            gl.uniformMatrix3fv(uModel, false, r.map((x) => x * scale));
            gl.uniform3f(uLight, (mouse[0] * viewHeight * aspect) / 2, (mouse[1] * viewHeight) / 2, 4);
            gl.uniform1f(uAspect, aspect);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            gl.uniform1f(uPointScale, 0);
            gl.uniform1f(uOpacity, WIRE_OPACITY * Math.min(Math.max((t - 2) / 2, 0), 1));
            gl.drawElements(gl.LINES, edges.length, gl.UNSIGNED_SHORT, 0);
            // three's size attenuation: size * (drawing-buffer height / 2) / depth.
            gl.uniform1f(uPointScale, (POINT_SIZE * canvas.height) / 2);
            gl.uniform1f(uOpacity, Math.min(t / 3, 1));
            gl.drawArrays(gl.POINTS, 0, count);
        };
        resize();
        if (!reducedMotion) {
            const loop = (now: number) => {
                renderFrame!(now);
                requestAnimationFrame(loop);
            };
            requestAnimationFrame(loop);
        }
    });
