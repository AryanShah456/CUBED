'use strict';

(function () {

window.KociembaWASM = {
ready: false,
module: null
};

async function init() {
if (window.KociembaWASM.ready) return;

const mod = await import("https://cdn.jsdelivr.net/npm/kociemba-wasm/+esm");

await mod.default();

window.KociembaWASM.module = mod;
window.KociembaWASM.solve = mod.solve;
window.KociembaWASM.ready = true;

}

window.KociembaWASM.init = init;

})();