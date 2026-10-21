// Converts an OBJ into the compact binary the page loads:
// u32 vertex count | i16 positions (1/8192 units) | i8 normals | u16 wireframe edge pairs.
// The model is centered and scaled to HEIGHT world units here so the page does no setup.
// Usage: node scripts/skull.mjs skull.obj public/skull.bin
import { readFileSync, writeFileSync } from 'node:fs';

const HEIGHT = 4.2;
const [src, out] = process.argv.slice(2);
const pos = [];
const tris = [];
for (const line of readFileSync(src, 'utf8').split('\n')) {
    const [k, ...a] = line.trim().split(/\s+/);
    if (k === 'v') pos.push(a.map(Number));
    // Fan-triangulate like three's OBJLoader, so the wireframe keeps the quad diagonals.
    if (k === 'f') {
        const f = a.map((s) => parseInt(s) - 1);
        for (let i = 1; i < f.length - 1; i++) tris.push([f[0], f[i], f[i + 1]]);
    }
}

const min = [0, 1, 2].map((i) => Math.min(...pos.map((p) => p[i])));
const max = [0, 1, 2].map((i) => Math.max(...pos.map((p) => p[i])));
const s = HEIGHT / (max[1] - min[1]);
const v = pos.map((p) => p.map((x, i) => (x - (min[i] + max[i]) / 2) * s));

// Area-weighted smooth normals.
const n = v.map(() => [0, 0, 0]);
const sub = (a, b) => a.map((x, i) => x - b[i]);
for (const [a, b, c] of tris) {
    const [e, f] = [sub(v[b], v[a]), sub(v[c], v[a])];
    const cross = [e[1] * f[2] - e[2] * f[1], e[2] * f[0] - e[0] * f[2], e[0] * f[1] - e[1] * f[0]];
    for (const i of [a, b, c]) for (let k = 0; k < 3; k++) n[i][k] += cross[k];
}

const edges = new Set();
for (const [a, b, c] of tris)
    for (const [x, y] of [[a, b], [b, c], [c, a]]) edges.add(x < y ? x * 65536 + y : y * 65536 + x);

const count = v.length;
const buf = Buffer.alloc(4 + 6 * count + 3 * count + (count % 2) + 4 * edges.size);
let o = buf.writeUInt32LE(count, 0);
for (const p of v) for (const x of p) o = buf.writeInt16LE(Math.round(x * 8192), o);
for (const p of n) {
    const l = Math.hypot(...p) || 1;
    for (const x of p) o = buf.writeInt8(Math.round((x / l) * 127), o);
}
o += count % 2;
for (const e of edges) {
    o = buf.writeUInt16LE(Math.floor(e / 65536), o);
    o = buf.writeUInt16LE(e % 65536, o);
}
writeFileSync(out, buf);
console.log(`${count} vertices, ${edges.size} edges, ${buf.length} bytes`);
