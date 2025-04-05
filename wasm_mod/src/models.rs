use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_client_solana::solana_account_decoder::parse_token::UiTokenAmount;

/// Use this response type to discard the response payload
#[derive(Debug, Deserialize, Serialize)]
pub struct IgnoredData {}

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct MyBalance {
    pub balance: u64,
    pub tokens: String, // UiTokenAmount, //TODO
}

#[derive(Serialize, Deserialize, Debug)]
pub struct MyWallet {
    pub name: String,
    pub pubkey: String,
    pub keypair: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub account_info: Option<MyBalance>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct MyNetworks {
    pub networks: Vec<MyNetwork>,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug, Default)]
pub struct MyNetwork {
    pub id: i32,
    name: String,
    address: String,
    pub active: bool,
}

#[wasm_bindgen]
impl MyNetwork {
    pub fn new_default_id(name: String, address: String, active: bool) -> MyNetwork {
        MyNetwork{
            id: Default::default(),
            name,
            address,
            active,
        }
    }
    
    #[wasm_bindgen(constructor)]
    pub fn new(id: i32, name: String, address: String, active: bool) -> MyNetwork {
        MyNetwork{
            id,
            name,
            address,
            active,
        }
    }
    
    #[wasm_bindgen(getter)]
    pub fn name(&self) -> String {
        self.name.clone()
    }
    #[wasm_bindgen(setter)]
    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }
    #[wasm_bindgen(getter)]
    pub fn address(&self) -> String {
        self.address.clone()
    }
    #[wasm_bindgen(setter)]
    pub fn set_address(&mut self, address: String) {
        self.address = address;
    }
}
