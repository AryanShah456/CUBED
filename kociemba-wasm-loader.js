'use strict';

/*
Kociemba WASM Loader
Updated to be robust against module export changes
*/

window.KociembaSolver = {
  ready: false,
  module: null
};

async function loadKociembaWASM() {
  if (window.KociembaSolver.ready) return;

  try {
    const wasmModule = await import("https://cdn.jsdelivr.net/npm/kociemba-wasm/+esm");
    
    // Check if the module has a 'default' function (common) 
    // or if the module itself is the function (also common)
    if (typeof wasmModule.default === 'function') {
      await wasmModule.default();
    } else if (typeof wasmModule === 'function') {
      await wasmModule();
    } else {
      // Fallback if the library structure changed significantly
      console.warn("WASM Module export structure:", wasmModule);
      // Attempt to find any function export if default doesn't exist
      const keys = Object.keys(wasmModule);
      if (keys.length > 0 && typeof wasmModule[keys[0]] === 'function') {
         await wasmModule[keys[0]]();
      }
    }

    window.KociembaSolver.module = wasmModule;
    // Assuming 'solve' is a named export, or attached to the module
    window.KociembaSolver.solve = wasmModule.solve || wasmModule.default.solve;
    window.KociembaSolver.ready = true;
    console.log("Kociemba WASM loaded successfully.");
    
  } catch (err) {
    console.error("Failed to load Kociemba WASM:", err);
    throw err;
  }
}

window.KociembaSolver.init = loadKociembaWASM;