import initWasmModule, { init_wasm } from './wasm/wasm_mod.js';

(async () => {
    await initWasmModule();
    init_wasm(); // this call logs a hello message from WASM for demo purposes
    report_state("wasm initialized");
})();
