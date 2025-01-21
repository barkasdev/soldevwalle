#[macro_use]
mod client;
mod api_wrappers;
mod constants;
mod models;

use constants::log;
use solana_sdk::pubkey;
use sqlite_wasm_rs::{c as ffi, init_sqlite, libsqlite3, sqlite};
use sqlite_wasm_rs::libsqlite3::*;
use std::ffi::CString;
use sqlite_wasm_rs::c::SQLITE_OK;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use wasm_client_solana::{SolanaRpcClient, DEVNET};
use web_sys::{Window, WorkerGlobalScope};

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

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = sqlite3)]
    pub fn initSqlite3() -> js_sys::Promise;
}


fn cstr(s: &str) -> CString {
    CString::new(s).unwrap()
}

/// A demo function to test if WASM is callable from background.js
#[wasm_bindgen]
pub async fn init_wasm() {
    //sqlite
    let sqlite_init = ffi::init_sqlite().await;
    if sqlite_init.is_err() {
        //FIXME guard
        log("Failed to initialize sqlite database");
        return;
    }
    let mut db = std::ptr::null_mut();
    let filename = CString::new("soldevwalle.db").unwrap();
    // let filename = CString::new("memory:soldevwalle.db").unwrap();
    // See <https://sqlite.org/wasm/doc/trunk/persistence.md#opfs>
    let vfs = CString::new("opfs").unwrap();
    let ret = unsafe {
        ffi::sqlite3_open_v2(
            filename.as_ptr(),
            &mut db as *mut _,
            ffi::SQLITE_OPEN_READWRITE | ffi::SQLITE_OPEN_CREATE,
            // Using std::ptr::null() is a memory DB
            std::ptr::null(),
            // vfs.as_ptr(),
        )
    };
    if ret == ffi::SQLITE_OK {
        log("sqlite initialized");
    } else {
        log("failed to initialize sqlite db");
    }
    let errmsg = std::ptr::null_mut();
    // let sql = cstr("DROP TABLE COMPANY;");
    // let ret = unsafe { ffi::sqlite3_exec(db, sql.as_ptr(), None, std::ptr::null_mut(), errmsg) };
    // log(format!("sqlite exec returned: {}", &ret).as_str());
    let sql = cstr(
        "CREATE TABLE IF NOT EXISTS COMPANY(
                        NAME           TEXT    NOT NULL );",
    );
    
    let ret = unsafe { ffi::sqlite3_exec(db, sql.as_ptr(), None, std::ptr::null_mut(), errmsg) };
    log(format!("sqlite exec returned: {}", &ret).as_str());
    
    let sql = cstr(
        "INSERT INTO COMPANY(\
        NAME) VALUES (\
        \"John Doe\") ON CONFLICT DO NOTHING \
        "
    );
    
    let ret = unsafe { ffi::sqlite3_exec(db, sql.as_ptr(), None, std::ptr::null_mut(), errmsg) };
    log(format!("sqlite insert into company returned: {}", &ret).as_str());
    // SQLITE_OK
    //
    let client = SolanaRpcClient::new(DEVNET);
    let address = pubkey!("GDX3G2D84Mj99XGMkVrp9vsHUHTzzuW7uh5tHrpehKbQ");
    // log("requesting airdrop");
    // client
    //     .request_airdrop(&address, sol_to_lamports(1.0))
    //     .await.unwrap();
    let account = client.get_account(&address).await;
    // let drop = client.request_airdrop(&address, sol_to_lamports(1.0)).await;
    log("init WASM!");
    log(format!("{account:#?}").as_str());
    log("huy!");
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
