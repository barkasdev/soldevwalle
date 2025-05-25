# SolDevWalle

**SolDevWalle** is a Solana developer wallet browser extension designed to streamline smart contract testing and development. It integrates WebAssembly (WASM) modules compiled from Rust, providing a seamless development experience.

---

## 🚀 Features

* Lightweight and developer-friendly Solana wallet extension.
* Built with React and Rust for optimal performance.
* Supports both Chrome and Firefox browsers.
* Includes a WASM module for enhanced cryptographic operations.
* Precompiled extension packages available for quick setup.

---

## 🛠️ Getting Started

### Prerequisites

* [Rust](https://www.rust-lang.org/tools/install)
* [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)
* [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/)

### Building the WASM Module

Navigate to the project root directory and execute the following command:

```bash
wasm-pack build wasm_mod --release --no-typescript \
  --out-dir extension_react_example/public/wasm \
  --out-name wasm_mod --target web
```



For Windows PowerShell users:

```powershell
$env:RUSTFLAGS='--cfg getrandom_backend="wasm_js"'
wasm-pack build wasm_mod --release --no-typescript `
  --out-dir extension_react_example/public/wasm `
  --out-name wasm_mod --target web
```



### Running the React Application

Navigate to the `extension_react_example` directory:

```bash
cd extension_react_example
npm install
npm start
```



This will start the development server and open the application in your default browser.

---

## 📦 Packaging the Extension

To build the extension packages for Chrome and Firefox:

```bash
bash build.sh
```



This script will generate `chrome.zip` and `firefox.zip` files, which can be loaded into their respective browsers.

---

## 🧩 Loading the Extension

### Chrome

1. Open `chrome://extensions/` in your Chrome browser.
2. Enable "Developer mode" using the toggle switch.
3. Click on "Load unpacked" and select the `extension` directory.


## 📁 Project Structure

```
soldevwalle/
├── wasm_mod/                   # Rust source code for the WASM module
├── extension_react_example/    # React frontend for the extension
├── extension/                  # Compiled extension files
├── build.sh                    # Script to build extension packages
├── chrome.zip                  # Chrome extension package
├── firefox.zip                 # Firefox extension package
├── README.md                   # Project documentation
└── LICENSE                     # MIT License
```



---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

For more information and updates, visit the [GitHub repository](https://github.com/barkasdev/soldevwalle).

---
