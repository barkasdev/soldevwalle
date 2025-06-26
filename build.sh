## --release or --dev - exclude/include debug info
## --no-typescript - disable .d.ts files output
## --out-dir - where to write the compiled files
## --out-name - force output file names
## --target - always use "web"!
## See https://rustwasm.github.io/wasm-pack/book/commands/build.html
echo Building wasm module...
echo "Checking wasm-bindgen-cli version..."

REQUIRED_VERSION="0.2.100"
INSTALLED_VERSION=$(wasm-bindgen --version 2>/dev/null | awk '{print $2}')

if [ "$INSTALLED_VERSION" != "$REQUIRED_VERSION" ]; then
  echo "Installing wasm-bindgen-cli version $REQUIRED_VERSION..."
  cargo install wasm-bindgen-cli --version "$REQUIRED_VERSION" --force
else
  echo "wasm-bindgen-cli $REQUIRED_VERSION already installed."
fi

echo "🚀 Building wasm module..."
#RUSTFLAGS='--cfg getrandom_backend="wasm_js"' wasm-pack build wasm_mod --dev --no-typescript --out-dir "../extension/js/wasm" --out-name "wasm_mod" --target web
#RUSTFLAGS='--cfg getrandom_backend="wasm_js"' wasm-pack build wasm_mod --release --no-typescript --out-dir "../extension_react_example/public/wasm" --out-name "wasm_mod" --target web
RUSTFLAGS='--cfg getrandom_backend="wasm_js"' wasm-pack build wasm_mod --release --no-typescript --out-dir "../extension_react_example/public/wasm" --out-name "wasm_mod" --target web
# RUSTFLAGS='--cfg getrandom_backend="wasm_js"' wasm-pack build wasm_mod --release --no-typescript --out-dir "../extension/js/wasm" --out-name "wasm_mod" --target web
cd extension_react_example
npm run build
cd ..
# echo "Removing trash files..."
# rm -f extension/js/wasm/.gitignore
# rm -f extension/js/wasm/package.json

# Create Chrome package
echo "📦 Packaging Chrome extension (from build folder)..."

rm -f chrome.zip

if [ -d extension_react_example/build ]; then
  (cd extension_react_example/build && zip -rq ../../chrome.zip .) && \
  echo "✅ Chrome package created: chrome.zip"
else
  echo "❌ Build folder not found. Did you run the React build?"
fi
# # Create Firefox package
# echo "Packaging Firefox extension..."
# rm -f firefox.zip
# (cd extension && zip -rq ../firefox.zip . -x manifest_cr.json -x manifest.json)
# if [ -f firefox.zip ]; then
#   echo "@ manifest_ff.json\n@=manifest.json" | zipnote firefox.zip | zipnote -w firefox.zip || echo "Warning: zipnote failed for Firefox"
#   echo "✅ Firefox package: firefox.zip"
# else
#   echo "❌ Failed to create firefox.zip"
# fi
