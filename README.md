# solldevwalle

Solana Developer Wallet Extension

To deploy first run the following command in the main folder:
For Windows
$env:RUSTFLAGS='--cfg getrandom_backend="wasm_js"'; wasm-pack build wasm_mod --release --no-typescript --out-dir "../extension_react_example/public/wasm" --out-name "wasm_mod" --target web
For Linux
wasm-pack build wasm_mod --release --no-typescript --out-dir "../extension_react_example/public/wasm" --out-name "wasm_mod" --target web
or simply run build.sh

Afterwards in the extension_react_example run
npm install

and 

npm run build 

in that order


Unpack the build folder when loading the extension in the browser


For github authentication 

inside manifest.json oauth2
change client id to your github client id

inside SignIn page
change client id to your github client id
change redirect redirectUri to deployed Wallet Page URL

then inside OAuth app Replace the Homepage and Callback URL with Wallet Page URL after deployment


./build.sh

builds and packs extensions chrome.zip, firefox.zip

* Debug in `Chrome`: 
* Extensions -> Manage extensions
* 'Load unpacked', choose `extension` folder
* To see extension console: `Service Worker` link (not dev tools)
* if javascript/html changed: no need to rebuild, 'reload' in Chrome extensions

* ext html: popup.html (initializes every time on toolbar click) + popup.js
* service worker: background.js (initializes wasm and exposes interfaces) 
* messages bus: progress.js (communicates wasm <-> progress.js <-> popup.js)
* from wasm to popup:
  * 
```rust
#[wasm_bindgen(module = "/src/progress.js")]
extern "C" {
pub fn report_progress(msg: &str);
}
``` 
* from popup to wasm:
    * popup.js
```javascript
      await chrome.runtime.sendMessage({ action: "btn_add", additional_data: 'FROM POPUP TO BACK' });
```
*
     *    --> background.js

```javascript
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
```
*    
  * calls exposed wasm function
  * wasm response: see report_progress
  
