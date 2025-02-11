use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_client_solana::solana_account_decoder::parse_token::UiTokenAmount;

/// Use this response type to discard the response payload
#[derive(Debug, Deserialize, Serialize)]
pub struct IgnoredData {}

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct MyBalance {
    pub balance: Option<u64>,
    pub tokens: Option<UiTokenAmount>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct MyWallet {
    pub pubkey: String,
    pub keypair: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub account_info: Option<MyBalance>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct MyNetworks {
    pub networks: Vec<MyNetwork>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct MyNetwork {
    pub name: String,
    pub address: String,
    pub active: bool,
}
