// offscreen.js
async function loadWasmModule() {
    try {
      // Dynamically import your WASM bindings using the extension's URL
      const wasmModule = await import(chrome.runtime.getURL("wasm/wasm_mod.js"));
      
      // Call the exported function (e.g. init_wasm)
      const result = wasmModule.init_wasm();
      console.log("WASM module initialized in offscreen:", result);
      
      // Send a message back to the background worker with the result
      chrome.runtime.sendMessage({ type: "wasmResponse", data: result });
    } catch (error) {
      console.error("Error initializing WASM in offscreen:", error);
      chrome.runtime.sendMessage({ type: "wasmError", error: error.toString() });
    }
  }
  
  // When the offscreen document loads, immediately attempt to load the WASM module.
  //loadWasmModule();
  