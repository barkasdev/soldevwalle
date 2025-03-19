#[macro_use]
mod client;
mod api_wrappers;
mod constants;
mod db;
mod models;

use crate::models::MyNetwork;
use constants::log;
use js_sys::Promise;
use solana_sdk::pubkey;
use std::ffi::CString;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use wasm_bindgen_futures::future_to_promise;
use wasm_client_solana::prelude::{FutureExt, TryStreamExt};
use wasm_client_solana::{SolanaRpcClient, DEVNET};
use web_sys::{Window, WorkerGlobalScope};
extern crate console_error_panic_hook;
use std::panic;

/// Contains the right type of the browser runtime for the current browser
pub(crate) enum BrowserRuntime {
    ChromeWorker(WorkerGlobalScope),
    FireFoxWindow(Window),
}

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

/// Makes JS `console.log` available in Rust
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace=console)]
    fn log(s: &str);
}

#[wasm_bindgen(start)]
pub fn main() {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    // console_error_panic_hook::set_once();
}

#[wasm_bindgen]
pub async fn init_wasm(wallet_store_password: String) {
    log("Initializing wasm...");
    // let db = db::create_database().await.inspect_err(|e| log(format!("error creating db: {:?}", e).as_str()));
    client::seed_initial_data(wallet_store_password).await;
    // match db {
    //     Ok(db) => {
    //         if let Err(db_err) = db::try_seed_data(&db).await {
    //             log(&format!("error seeding: {}", db_err));
    //         }
    //     }
    //     Err(db_err) => {
    //         log(&format!("error creating database: {}", db_err));
    //     }
    // }
    
    // let client = SolanaRpcClient::new(DEVNET);
    // let address = pubkey!("GDX3G2D84Mj99XGMkVrp9vsHUHTzzuW7uh5tHrpehKbQ");
    // // log("requesting airdrop");
    // // client
    // //     .request_airdrop(&address, sol_to_lamports(1.0))
    // //     .await.unwrap();
    // let account = client.get_account(&address).await;
    // // let drop = client.request_airdrop(&address, sol_to_lamports(1.0)).await;
    // log(format!("{account:#?}").as_str());

    // let _networks = get_networks().await;
    // log(format!("(init_wasm) networks: {:#?}", _networks).as_str());

    // let _wallets = get_wallets().await;
    // log(format!("{:#?}", wallets).as_str());

    log("init Wasm end");
}

/// The main entry point callable from `background.js`.
#[wasm_bindgen]
pub async fn report_state(msg: &str) {
    // try to init the browser runtime, but there is nothing we can do if it's missing
    // if it does, there is either a bug or something changed in the browser implementation
    // The runtime is a global singleton. It can probably work with OnceCell or lazy_static!.
    let runtime = match get_runtime().await {
        Ok(v) => v,
        Err(e) => {
            log!("report_state error: {e}");
            report_progress(e);
            return;
        }
    };
    log(&format!(
        "(backend)lib.rs: submitting the state for {}",
        msg
    ));
    report_progress(&format!(
        "(from lib.rs) submitting the state data for {}",
        msg
    ))
}

//get list of networks
#[wasm_bindgen]
pub async fn get_networks() {
    //TODO implement switching active network and updating in db
    let networks = client::get_networks().await;
    // log(format!("get_networks: {:#?}", networks).as_str());
    report_progress(&*serde_json::to_string_pretty(&networks).unwrap());
}
#[wasm_bindgen]
pub async fn get_networks_sync() -> Vec<MyNetwork> {
    client::get_networks().await
}

#[wasm_bindgen]
pub async fn get_networks_async() -> Promise {
    future_to_promise(client::get_networks_async())
}

#[wasm_bindgen]
pub async fn set_active_network(name: String) {
    let res = client::set_active_network(name).await;
    report_progress(&*serde_json::to_string_pretty(&res).unwrap());
}

#[wasm_bindgen]
pub async fn get_wallets() {
    let wallets = client::get_wallets().await;
    // log(format!("get_wallets: {:#?}", wallets).as_str());
    report_progress(&*serde_json::to_string_pretty(&wallets).unwrap());
}

#[wasm_bindgen]
pub async fn create_wallet(wallet_name: String, wallet_store_password: String) {
    let created_result = client::create_wallet(wallet_name, wallet_store_password).await;
    let created_result = match created_result {
        Ok(v) => v.as_string().unwrap_or(String::from("No wallet data")),
        Err(e) => e.to_string(),
    };
    report_progress(&*serde_json::to_string(&created_result).unwrap());
}

#[wasm_bindgen]
pub async fn request_airdrop(to_pubkey: &str, sol_quantity: f64) {
    let airdrop = client::request_airdrop(to_pubkey, sol_quantity).await;
    report_progress(&*serde_json::to_string_pretty(&airdrop).unwrap());
}

#[wasm_bindgen]
pub async fn send_sol(
    from_pubkey: &str,
    to_pubkey: &str,
    sol: f64,
    wallet_store_password: String,
) {
    let send_result =
        client::send_sol(from_pubkey, to_pubkey, sol, wallet_store_password).await;
    report_progress(&*serde_json::to_string_pretty(&send_result).unwrap());
}

/// This is a proxy for report_progress() in progress.js
/// to send messages to other js scripts.
#[wasm_bindgen(module = "/src/progress.js")]
extern "C" {
    pub fn report_progress(msg: &str);
}

/// All error handling in this crate is based on either retrying a request after some time
/// or exiting gracefully.
#[derive(Debug, Clone)]
pub enum RetryAfter {
    Seconds(i64),
    Never,
}

/// The result type that should be used in place of std::Result
/// throughout the app
pub type Result<T> = std::result::Result<T, RetryAfter>;

#[allow(dead_code)]
pub fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

// pub async fn sleep(duration: Duration) {
//     JsFuture::from(Promise::new(&mut |yes, _| {
//         window()
//             .unwrap()
//             .set_timeout_with_callback_and_timeout_and_arguments_0(
//                 &yes,
//                 duration.as_millis() as i32,
//             )
//             .unwrap();
//     }))
//     .await
//     .unwrap();
// }

/// Returns the right type of runtime for the current browser because
/// Firefox and Chrome do not agree on the parent object for Runtime in WebWorkers.
/// Firefox uses Window and Chrome uses WorkerGlobalScope.
async fn get_runtime() -> std::result::Result<BrowserRuntime, &'static str> {
    // try for chrome first and return if found
    // it should also work if FF switches to using WorkerGlobalScope as they should
    match js_sys::global().dyn_into::<WorkerGlobalScope>() {
        Ok(v) => {
            return Ok(BrowserRuntime::ChromeWorker(v));
        }
        Err(e) => {
            log!("ServiceWorkerGlobalScope unavailable");
            log!("{:?}", e);
        }
    };

    // this is a fallback for Firefox, but it does not make sense why they would use Window in
    // web workers
    match web_sys::window() {
        Some(v) => {
            return Ok(BrowserRuntime::FireFoxWindow(v));
        }
        None => {
            log!("Window unavailable");
        }
    };

    // no runtime was found, which is a serious problem
    // because all fetch calls require it
    // TODO: may be worth a retry
    Err("Missing browser runtime. It's a bug.")
}
