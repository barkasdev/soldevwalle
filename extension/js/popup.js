console.log('loading popup.js, document.readyState: ', document.readyState);

// A placeholder for OnSuccess in .then
function onSuccess(message) {
    // console.log(`Send OK: ${JSON.stringify(message)}`);
}

// A placeholder for OnError in .then
function onError(error) {
    console.error(`Promise error: ${error}`);
}

// Click handlers should be added when the popup is opened.
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', async function () {
        afterDOMLoaded();
    });
} else {
    afterDOMLoaded();
}

function afterDOMLoaded() {
    console.log('afterDOMLoaded, document.readyState: ', document.readyState);
    console.log('Toolbar button clicked');
}


document.addEventListener('DOMContentLoaded', async function () {
 let btn = document.getElementById("btn_add");
  btn.addEventListener("click", async (evt) => {
    console.log("btn_add button clicked");
      await chrome.runtime.sendMessage({ action: "btn_add", additional_data: 'FROM POPUP TO BACK' });
    });
});

console.log('loading-2 popup.js, document.readyState: ', document.readyState);
// listens for msgs from WASM
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

        console.log("(frontend)popup.js: onMessage")
        // background.js may send a status update as boolean because
        // there is no badge change event
        if (typeof msg === "boolean") {
            document.getElementById("btn_add").disabled = msg;
            return;
        }

        // if it's not a bool, then it is a log entry as a string
        const log = document.getElementById("log");

        const lastMsg = document.getElementById("log-summary").innerText;
        if (lastMsg) {
            const p = document.createElement("p");
            p.innerText = lastMsg;

            log.insertBefore(p, log.firstChild);
        }

        document.getElementById("log-summary").innerText = msg;
    }
);

