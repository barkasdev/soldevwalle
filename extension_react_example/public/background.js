import initWasmModule, { init_wasm, get_networks, get_networks_async } from "./wasm/wasm_mod.js";  // ✅ Static Import

(async () => {
    await initWasmModule();  // ✅ Initialize WASM
    init_wasm();  // ✅ Call WASM function
    get_networks_async();
    console.log("WASM Initialized in Background");
})();

console.log("Background script started");
