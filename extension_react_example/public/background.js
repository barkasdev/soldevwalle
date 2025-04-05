import initWasmModule, { init_wasm, report_state, get_wallets, get_networks_async, set_active_network, send_sol, request_airdrop } from './wasm/wasm_mod.js';

let storedNetworks = [];
let storedWallets = [];


(async () => {
    await initWasmModule();
    console.log("wasm initialized");
    await init_wasm('password'); // Logs a hello message from WASM
    report_state("wasm initialized");

    // Fetch data immediately when the script runs
    await fetchNetworks();
    await fetchWallets();

    //  Also fetch on extension install/update
    chrome.runtime.onInstalled.addListener(async () => {
        console.log("Extension installed - Fetching Networks & Wallets...");
        await fetchNetworks();
        await fetchWallets();
    });

    //  Listen for messages from React (Popup/Wallet Page)
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === "GET_NETWORKS") {
            console.log("Background - Sending Networks:", storedNetworks);
            sendResponse({ networks: storedNetworks });
        } else if (request.type === "GET_WALLETS") {
            console.log("Background - Sending Wallets:", storedWallets);
            sendResponse({ wallets: storedWallets });
        }
        return true; // Keeps the response channel open for async responses
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const url = tabs[0].url;
            console.log("Current tab URL:", url);
        } else {
            console.log("No active tab found.");
        }
    });

    console.log("The networks are:", storedNetworks);
    console.log("The wallets are:", storedWallets);
})();

async function fetchNetworks() {
    try {
        const networks = await get_networks_async();
        storedNetworks = networks; // Store networks globally
        console.log("Background - Stored Networks:", storedNetworks);
    } catch (error) {
        console.error("Error fetching networks:", error);
        storedNetworks = [];
    }
}

async function fetchWallets() {
    try {
        const wallets = await get_wallets();
        storedWallets = wallets; // Store wallets globally
        console.log("Background - Stored Wallets:", storedWallets);
    } catch (error) {
        console.error("Error fetching wallets:", error);
        storedWallets = [];
    }
}


