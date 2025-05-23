// A static import is required in b/g scripts because they are executed in their own env
// not connected to the content scripts where wasm is loaded automatically
import initWasmModule, {get_wallets} from './wasm/wasm_mod.js';
import {init_wasm, report_state} from './wasm/wasm_mod.js';


console.log("Background script started");
// console.log(await chrome.permissions.getAll());




// run the wasm initializer before calling wasm methods
// the initializer is generated by wasm_pack
(async () => {
    console.log("initWasmModule start");
    await initWasmModule();
    console.log("initWasmModule success");

    await init_wasm("test-password");
    console.log("initWasmModule done");
    // let nas = await get_networks_async();
    // console.log("nas", nas);
    let wallets = await get_wallets();
    console.log("wallets", wallets);
    // await request_airdrop("DAFXYLRXSdSSuwTWNVxxQ5eEVX9Rqw1FDwjohjUHomjC", 2);
    // await send_sol("EeWa2Z54UfR1DJsrHwbe4CL3eZdEUigZV77KPduKNzVx", "DAFXYLRXSdSSuwTWNVxxQ5eEVX9Rqw1FDwjohjUHomjC", 0.00001, "test-password");
    // await delete_wallet("2b85ZxNAyZirNUQ1q7y7H6WNRCBfqL4MQViG1NA4BkjV");
    await report_state("wasm initialized");
})();

// A placeholder for OnSuccess in .then
function onSuccess(message) {
    // console.log(`Send OK: ${JSON.stringify(message)}`);
}

// A placeholder for OnError in .then
function onError(error) {
    console.error(`Promise error: ${error}`);
}

// A placeholder for OnError in .then
function onErrorWithLog(error) {
    console.error(`Promise error: ${error}`);
}

// Popup button handler
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    console.log(`Popup message received: ${JSON.stringify(request)}, ${JSON.stringify(sender)}`);

    // call the WASM code



        // call WASM
        report_state(JSON.stringify(request))
            .catch((e) => {
                console.error(e);
                chrome.runtime.sendMessage(JSON.stringify(e)).then(onSuccess, onError);
            })
            .finally(() => {
                // reset WASM, log to inactive
            })
});



onmessage = e => {
    const message = e.data
    console.log(`background.js: ${message}`);
}



