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