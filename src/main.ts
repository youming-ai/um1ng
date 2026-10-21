import '@fontsource/geist-pixel';
import './styles.css';
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

// Dimensions and point size are tuned for public/models/skull.obj.
const SKULL_HEIGHT = 4.2; // world units, camera sits at z=6
const INTRO_ZOOM = 5; // starts this many times larger, eases down to 1
const POINT_SIZE = 0.02;

const canvas = document.querySelector<HTMLCanvasElement>('#skull')!;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
scene.fog = new THREE.Fog('#3c3c5d', 0, 25);
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
camera.position.z = 6;

const light = new THREE.PointLight('white', 4 * Math.PI, 10);
scene.add(light);

const skull = new THREE.Group();
scene.add(skull);

const wireMaterial = new THREE.MeshPhongMaterial({ color: 'white', wireframe: true, transparent: true, opacity: 0 });
const pointMaterial = new THREE.PointsMaterial({ color: 'white', size: POINT_SIZE, transparent: true, opacity: 0 });

const SCATTER_RADIUS = 0.6; // world units around the pointer ray
const SCATTER_FORCE = 0.04;
const SCATTER_RETURN = 0.92; // per-frame decay of the offset, lower snaps back faster

const mouse = new THREE.Vector2();
const gaze = new THREE.Vector2();
let pointerActive = false;
if (!reducedMotion) {
    addEventListener('pointermove', (e) => {
        mouse.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
        pointerActive = true;
    });
    document.addEventListener('pointerleave', () => (pointerActive = false));
}

// Vertices near the pointer ray get pushed away from it, then ease back to rest.
type Scatter = { mesh: THREE.Mesh; attr: THREE.BufferAttribute; rest: Float32Array; offset: Float32Array; jitter: Float32Array };
const scatters: Scatter[] = [];
const raycaster = new THREE.Raycaster();
const ray = new THREE.Ray();
const inverse = new THREE.Matrix4();
const v = new THREE.Vector3();
const closest = new THREE.Vector3();
function scatter() {
    raycaster.setFromCamera(mouse, camera);
    for (const s of scatters) {
        inverse.copy(s.mesh.matrixWorld).invert();
        ray.copy(raycaster.ray).applyMatrix4(inverse);
        const radius = SCATTER_RADIUS / s.mesh.matrixWorld.getMaxScaleOnAxis();
        const { rest, offset, jitter } = s;
        for (let i = 0; i < rest.length; i += 3) {
            if (pointerActive) {
                v.fromArray(rest, i);
                ray.closestPointToPoint(v, closest);
                const d = v.distanceTo(closest);
                if (d < radius && d > 0) {
                    const push = (1 - d / radius) * SCATTER_FORCE * radius * jitter[i / 3];
                    v.sub(closest).multiplyScalar(push / d);
                    offset[i] += v.x;
                    offset[i + 1] += v.y;
                    offset[i + 2] += v.z;
                }
            }
            for (let k = i; k < i + 3; k++) {
                offset[k] *= SCATTER_RETURN;
                s.attr.array[k] = rest[k] + offset[k];
            }
        }
        s.attr.needsUpdate = true;
    }
}

let renderFrame: ((now: number) => void) | undefined;
function resize() {
    const { clientWidth: width, clientHeight: height } = canvas;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (reducedMotion) renderFrame?.(performance.now());
}
new ResizeObserver(resize).observe(canvas);

new OBJLoader().load('/models/skull.obj', (obj) => {
    const model = new THREE.Group();
    obj.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
            const { geometry } = child as THREE.Mesh;
            const mesh = new THREE.Mesh(geometry, wireMaterial);
            model.add(mesh, new THREE.Points(geometry, pointMaterial));
            const attr = geometry.attributes.position as THREE.BufferAttribute;
            const rest = Float32Array.from(attr.array);
            const jitter = Float32Array.from({ length: attr.count }, () => 0.5 + Math.random());
            scatters.push({ mesh, attr, rest, offset: new Float32Array(rest.length), jitter });
        }
    });
    // The OBJ's units are arbitrary: center it and scale it to SKULL_HEIGHT.
    const box = new THREE.Box3().setFromObject(model);
    model.position.copy(box.getCenter(new THREE.Vector3()).negate());
    const scaledModel = new THREE.Group().add(model);
    scaledModel.scale.setScalar(SKULL_HEIGHT / box.getSize(new THREE.Vector3()).y);
    skull.add(scaledModel);

    const start = performance.now();
    renderFrame = (now) => {
        const t = reducedMotion ? Infinity : (now - start) / 1000;
        skull.scale.setScalar(1 + (INTRO_ZOOM - 1) * Math.pow(2, -10 * Math.min(t / 6, 1)));
        pointMaterial.opacity = Math.min(t / 3, 1);
        wireMaterial.opacity = 0.2 * THREE.MathUtils.clamp((t - 2) / 2, 0, 1);

        gaze.lerp(mouse, 0.05);
        skull.lookAt(gaze.x, gaze.y, 1);
        skull.updateMatrixWorld();
        if (!reducedMotion) scatter();

        const viewHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
        light.position.set((mouse.x * viewHeight * camera.aspect) / 2, (mouse.y * viewHeight) / 2, 4);

        renderer.render(scene, camera);
    };
    resize();
    if (!reducedMotion) renderer.setAnimationLoop(renderFrame);
});
