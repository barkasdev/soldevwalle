import initWasmModule, { init_wasm, report_state, get_wallets, get_networks_async, set_active_network, send_sol, request_airdrop } from './wasm/wasm_mod.js';

let storedNetworks = [];
let storedWallets = [];


(async () => {
    await initWasmModule();
    console.log("wasm initialized");
    await init_wasm('test-password'); // Logs a hello message from WASM
    report_state("wasm initialized");
    
    //
    //
    // // Fetch data immediately when the script runs
    // await fetchNetworks();
    // await fetchWallets();
    //
    // //  Also fetch on extension install/update
    // chrome.runtime.onInstalled.addListener(async () => {
    //     console.log("Extension installed - Fetching Networks & Wallets...");
    //     await fetchNetworks();
    //     await fetchWallets();
    // });

    //  Listen for messages from React 
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        (async () => {
            switch (request.type) {
                case "GET_NETWORKS":
                    console.log("Background - Sending Networks:", storedNetworks);
                    sendResponse({ networks: storedNetworks });
                    break;

                case "GET_WALLETS":
                    console.log("Background - Sending Wallets:", storedWallets);
                    sendResponse({ wallets: storedWallets });
                    break;

                case "SET_NETWORK":
                    try {
                        const networkName = request.networkName;

                        console.log("Background - Calling set_active_network for:", networkName);
                        const result = await set_active_network(networkName);

                        // Update local state
                        storedNetworks = storedNetworks.map((net) => ({
                            ...net,
                            active: net.name === networkName,
                        }));

                        console.log("WASM set_active_network success:", result);
                        sendResponse({ success: true, message: "Network updated", result });
                    } catch (error) {
                        console.error("WASM set_active_network error:", error);
                        sendResponse({ success: false, message: "Failed to update network", error });
                    }
                    break;

                case "REQUEST_AIRDROP":
                    try {
                        const { to_pubkey, amount } = request;
                        console.log(`Requesting airdrop to ${to_pubkey} with ${amount} SOL`);

                        const result = await request_airdrop(to_pubkey, amount);

                        console.log("Airdrop success:", result);
                        sendResponse({ success: true, message: "Airdrop requested", result });
                    } catch (error) {
                        console.error("Airdrop error:", error);
                        sendResponse({ success: false, message: "Airdrop failed", error });
                    }
                    break;

                case "SEND_SOL":
                    try {
                        const { from_pubkey, to_pubkey, amount, wallet_store_password } = request;
                        console.log(`Sending ${amount} SOL from ${from_pubkey} to ${to_pubkey}`);

                        const result = await send_sol(from_pubkey, to_pubkey, amount, wallet_store_password);

                        console.log("SEND_SOL success:", result);
                        sendResponse({ success: true, message: "Transaction complete", result });
                    } catch (error) {
                        console.error("SEND_SOL error:", error);
                        sendResponse({ success: false, message: "Transaction failed", error });
                    }
                    break;


                default:
                    console.warn("Unknown request type:", request.type);
                    sendResponse({ success: false, message: "Unknown request type" });
            }
        })();

        return true; // Required for async sendResponse
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


