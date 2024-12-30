# solldevwalle


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
  
