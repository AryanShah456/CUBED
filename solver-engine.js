'use strict';

window.CubedSolver = window.CubedSolver || {};

const FACE_ORDER = ['U','R','F','D','L','B'];

/* Convert UI cube to Kociemba format */
function mapFacesToString(faces) {
  const colorMap = {};
  colorMap[faces.U[4]] = 'U';
  colorMap[faces.R[4]] = 'R';
  colorMap[faces.F[4]] = 'F';
  colorMap[faces.D[4]] = 'D';
  colorMap[faces.L[4]] = 'L';
  colorMap[faces.B[4]] = 'B';

  let out = '';
  for (let f of FACE_ORDER) {
    for (let c of faces[f]) {
      out += colorMap[c] || f;
    }
  }
  return out;
}

/* Kociemba Solver Wrapper */
async function solveWithWASM(state) {
  if (!window.KociembaSolver.ready) {
    await window.KociembaSolver.init();
  }
  return window.KociembaSolver.solve(state);
}

window.CubedSolver.cubeFromScramble = function(scramble) {
  // Simplistic scramble state tracker
  const cube = new CubeState();
  scramble.trim().split(/\s+/).forEach(m => cube.move(m));
  return { data: cube.state };
};

window.CubedSolver.cubeFromFaces = function(faces) {
  return { data: mapFacesToString(faces) };
};

/* The Fixed Solver Function */
window.CubedSolver.solveCube = async function(cubeObj) {
  const solution = await solveWithWASM(cubeObj.data);
  return {
    steps: [
      {
        label: "Kociemba WASM Solver",
        desc: "Optimal solution using WebAssembly",
        moves: solution
      }
    ],
    solved: true
  };
};

/* CubeState class logic remains same as your original file */
class CubeState {
  constructor(state) {
    this.state = state || "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";
  }
  move(m) {
    const turns = m.endsWith("2") ? 2 : m.endsWith("'") ? 3 : 1;
    const f = m[0];
    for (let i = 0; i < turns; i++) { this._apply(f); }
    return this;
  }
  _apply(f) {
    let s = this.state.split('');
    const cycle = (a,b,c,d) => { const t = s[a]; s[a] = s[b]; s[b] = s[c]; s[c] = s[d]; s[d] = t; };
    if (f === 'U') { cycle(0,2,8,6); cycle(1,5,7,3); cycle(9,18,27,36); cycle(10,19,28,37); cycle(11,20,29,38); }
    if (f === 'R') { cycle(2,5,8,11); cycle(20,23,26,29); cycle(38,41,44,47); cycle(14,17,20,23); }
    if (f === 'F') { cycle(6,7,8,9); cycle(18,21,24,27); cycle(29,32,35,38); cycle(11,14,17,20); }
    if (f === 'D') { cycle(45,46,47,48); cycle(24,33,42,51); cycle(25,34,43,52); cycle(26,35,44,53); }
    if (f === 'L') { cycle(0,3,6,9); cycle(18,21,24,27); cycle(36,39,42,45); cycle(12,15,18,21); }
    if (f === 'B') { cycle(0,1,2,3); cycle(11,14,17,20); cycle(27,30,33,36); cycle(45,48,51,54); }
    this.state = s.join('');
  }
}