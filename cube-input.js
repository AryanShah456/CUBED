'use strict';

/* ─── Colour palette for the picker ──────────────────────── */
const COLOR_MAP = {
  W: { label: 'White',  hex: '#f0ece4' },
  Y: { label: 'Yellow', hex: '#e8c547' },
  O: { label: 'Orange', hex: '#e05a2b' },
  R: { label: 'Red',    hex: '#e03b2b' },
  B: { label: 'Blue',   hex: '#3b82f6' },
  G: { label: 'Green',  hex: '#22c55e' },
};

const FACE_META = [
  { key:'U', label:'Top (White)',   center:'W', desc:'U face — white centre' },
  { key:'L', label:'Left (Blue)',   center:'B', desc:'L face — blue centre' },
  { key:'F', label:'Front (Orange)',center:'O', desc:'F face — orange centre' },
  { key:'R', label:'Right (Green)', center:'G', desc:'R face — green centre' },
  { key:'B', label:'Back (Red)',    center:'R', desc:'B face — red centre' },
  { key:'D', label:'Bottom (Yellow)',center:'Y', desc:'D face — yellow centre' },
];

/* ─── State ───────────────────────────────────────────────── */
let selectedColor = 'W';
let faceData = {}; // key -> 9-element array

function initFaceData() {
  FACE_META.forEach(f => {
    faceData[f.key] = Array(9).fill(null);
    faceData[f.key][4] = f.center; // fix centres
  });
}

/* ─── Build the 6-panel grid ─────────────────────────────── */
function buildFacePanels() {
  const container = document.getElementById('face-panels');
  container.innerHTML = '';

  FACE_META.forEach(face => {
    const panel = document.createElement('div');
    panel.className = 'face-panel';
    panel.dataset.face = face.key;

    const header = document.createElement('div');
    header.className = 'face-panel-header';
    header.innerHTML = `<span class="face-label">${face.label}</span>`;
    panel.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'face-grid';

    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.className = 'face-cell';
      cell.dataset.face = face.key;
      cell.dataset.idx = i;

      const color = faceData[face.key][i];
      if (color) {
        cell.style.background = COLOR_MAP[color].hex;
        cell.dataset.color = color;
      }

      // Centre cell is locked
      if (i === 4) {
        cell.classList.add('centre');
        cell.style.background = COLOR_MAP[face.center].hex;
        cell.dataset.color = face.center;
        cell.title = 'Centre (fixed)';
      } else {
        cell.addEventListener('click', onCellClick);
        cell.addEventListener('contextmenu', onCellRight);
      }

      grid.appendChild(cell);
    }
    panel.appendChild(grid);
    container.appendChild(panel);
  });
}

function onCellClick(e) {
  e.preventDefault();
  const face = e.currentTarget.dataset.face;
  const idx = parseInt(e.currentTarget.dataset.idx);
  faceData[face][idx] = selectedColor;
  e.currentTarget.style.background = COLOR_MAP[selectedColor].hex;
  e.currentTarget.dataset.color = selectedColor;
  updateCompletionBar();
}

function onCellRight(e) {
  e.preventDefault();
  const face = e.currentTarget.dataset.face;
  const idx = parseInt(e.currentTarget.dataset.idx);
  faceData[face][idx] = null;
  e.currentTarget.style.background = '';
  e.currentTarget.dataset.color = '';
  updateCompletionBar();
}

/* ─── Colour palette buttons ─────────────────────────────── */
function buildColorPicker() {
  const picker = document.getElementById('color-picker');
  picker.innerHTML = '';
  Object.entries(COLOR_MAP).forEach(([key, val]) => {
    const btn = document.createElement('button');
    btn.className = 'color-swatch';
    btn.dataset.color = key;
    btn.style.setProperty('--swatch', val.hex);
    btn.title = val.label;
    btn.setAttribute('aria-label', val.label);
    if (key === selectedColor) btn.classList.add('active');
    btn.addEventListener('click', () => {
      selectedColor = key;
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
    });
    picker.appendChild(btn);
  });
}

/* ─── Completion bar ─────────────────────────────────────── */
function updateCompletionBar() {
  let filled = 0;
  FACE_META.forEach(f => {
    faceData[f.key].forEach((v, i) => {
      if (v !== null && v !== undefined) filled++;
    });
  });
  const pct = Math.round((filled / 54) * 100);
  const bar = document.getElementById('completion-fill');
  const label = document.getElementById('completion-label');
  if (bar) bar.style.width = pct + '%';
  if (label) label.textContent = filled + '/54 stickers filled';
}

/* ─── Reset ───────────────────────────────────────────────── */
function resetFaces() {
  initFaceData();
  buildFacePanels();
  updateCompletionBar();
}

/* ─── Fill example (solved cube) ────────────────────────── */
function fillSolved() {
  FACE_META.forEach(f => {
    faceData[f.key] = Array(9).fill(f.center);
  });
  buildFacePanels();
  updateCompletionBar();
}

/* ─── Collect & validate faces for solver ───────────────── */
function collectFaces() {
  const out = {};
  let allFilled = true;
  FACE_META.forEach(f => {
    out[f.key] = faceData[f.key].map((v, i) => {
      if (v === null || v === undefined) { allFilled = false; return '?'; }
      return v;
    });
  });
  return { faces: out, allFilled };
}

/* ─── Tab switching ──────────────────────────────────────── */
function initTabs() {
  const tabs = document.querySelectorAll('.input-tab');
  const panels = document.querySelectorAll('.input-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
    });
  });
}

/* ─── Scramble validation ────────────────────────────────── */
function isValidMove(m) {
  return /^[UDFBLR][2']?$/.test(m);
}

function validateScramble(str) {
  if (!str.trim()) return { valid: false, error: 'Scramble is empty.' };
  const parts = str.trim().split(/\s+/);
  for (const p of parts) {
    if (!isValidMove(p)) return { valid: false, error: `"${p}" is not a valid move. Use U D F B L R with optional ' or 2.` };
  }
  return { valid: true };
}

/* ─── Solution renderer ──────────────────────────────────── */
function renderSolution(result, container) {
  if (!result || !result.steps) {
    container.innerHTML = '<p class="solve-error">Could not compute solution. Please check your input.</p>';
    return;
  }

  if (result.steps.length === 0) {
    container.innerHTML = `
      <div class="solve-done">
        <div class="solve-done-icon">✓</div>
        <p>Your cube is already solved!</p>
      </div>`;
    return;
  }

  let totalMoves = 0;
  result.steps.forEach(s => {
    if (s.moves) totalMoves += s.moves.trim().split(/\s+/).filter(Boolean).length;
  });

  const stepCount = result.steps.length;

  let html = `
    <div class="solve-summary">
      <div class="solve-stat"><span class="solve-stat-n">${stepCount}</span><span>stages</span></div>
      <div class="solve-stat"><span class="solve-stat-n">${totalMoves}</span><span>moves</span></div>
      <div class="solve-status ${result.solved?'ok':'err'}">${result.solved?'Fully solved':'Check input'}</div>
    </div>
    <ol class="solve-steps">`;

  result.steps.forEach((step, i) => {
    const moveList = step.moves ? step.moves.trim().split(/\s+/).filter(Boolean) : [];
    html += `
      <li class="solve-step">
        <div class="step-header">
          <span class="step-num">${i+1}</span>
          <div>
            <div class="step-label">${step.label}</div>
            <div class="step-desc">${step.desc}</div>
          </div>
        </div>
        <div class="step-moves">
          ${moveList.map(m => `<span class="move-chip" title="${moveName(m)}">${m}</span>`).join('')}
        </div>
      </li>`;
  });

  html += `</ol>`;
  container.innerHTML = html;
}

function moveName(m) {
  const names = {
    U:"Up", U2:"Up twice", "U'":"Up counter-clockwise",
    D:"Down", D2:"Down twice", "D'":"Down counter-clockwise",
    F:"Front", F2:"Front twice", "F'":"Front counter-clockwise",
    B:"Back", B2:"Back twice", "B'":"Back counter-clockwise",
    L:"Left", L2:"Left twice", "L'":"Left counter-clockwise",
    R:"Right", R2:"Right twice", "R'":"Right counter-clockwise",
  };
  return names[m] || m;
}

/* ─── Main solve handler ─────────────────────────────────── */
function handleSolve() {
  const activeTab = document.querySelector('.input-tab.active')?.dataset.tab;
  const resultEl = document.getElementById('solution-output');
  const loadingEl = document.getElementById('solving-loader');

  resultEl.innerHTML = '';
  if (loadingEl) loadingEl.style.display = 'flex';

  // Slight delay for UX
  setTimeout(() => {
    if (loadingEl) loadingEl.style.display = 'none';
    try {
      let cube;
      if (activeTab === 'scramble') {
        const scramble = document.getElementById('scramble-input').value;
        const v = validateScramble(scramble);
        if (!v.valid) {
          resultEl.innerHTML = `<p class="solve-error">⚠ ${v.error}</p>`;
          return;
        }
        cube = window.CubedSolver.cubeFromScramble(scramble);
      } else {
        const { faces, allFilled } = collectFaces();
        if (!allFilled) {
          resultEl.innerHTML = `<p class="solve-error">⚠ Please fill in all 54 stickers before solving.</p>`;
          return;
        }
        cube = window.CubedSolver.cubeFromFaces(faces);
        const v = window.CubedSolver.validateCube(cube);
        if (!v.valid) {
          resultEl.innerHTML = `<p class="solve-error">⚠ ${v.error}</p>`;
          return;
        }
      }
      const result = window.CubedSolver.solveCube(cube);
      renderSolution(result, resultEl);
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch(err) {
      resultEl.innerHTML = `<p class="solve-error">⚠ Error: ${err.message}</p>`;
    }
  }, 300);
}

/* ─── Init ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initFaceData();
  buildColorPicker();
  buildFacePanels();
  updateCompletionBar();
  initTabs();

  document.getElementById('btn-solve')?.addEventListener('click', handleSolve);
  document.getElementById('btn-reset-faces')?.addEventListener('click', resetFaces);
  document.getElementById('btn-fill-solved')?.addEventListener('click', fillSolved);

  // Random scramble generator
  document.getElementById('btn-random-scramble')?.addEventListener('click', () => {
    const moves = ['U','U\'','U2','D','D\'','D2','F','F\'','F2','B','B\'','B2','L','L\'','L2','R','R\'','R2'];
    let last = '';
    const scramble = [];
    for (let i=0;i<20;i++) {
      let m;
      do { m = moves[Math.floor(Math.random()*moves.length)]; } while (m[0]===last[0]);
      scramble.push(m); last=m;
    }
    document.getElementById('scramble-input').value = scramble.join(' ');
  });

  // Hamburger menu
  document.querySelector('.nav-hamburger')?.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('open');
  });
});
