import initWasmModule, { init_wasm, report_state, get_wallets, get_networks_async } from './wasm/wasm_mod.js';


(async () => {
    await initWasmModule();
    console.log("wasm initialized");
    await init_wasm('password'); // this call logs a hello message from WASM for demo purposes
    report_state("wasm initialized");
    try {
        const networks = await get_networks_async();
        console.log("networks: ", networks);
    }
    catch (e) {
        console.error(e, "error getting networks");
    }

    try {
        const wallets = await get_wallets();
        console.log("wallets: ", wallets);
    }
    catch (e) {
        console.error(e, "error getting wallets");
    }
})();
