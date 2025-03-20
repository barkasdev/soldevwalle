// use std::time::Duration;
// use crate::{
//     constants,
//     constants::log,
//     report_progress,
// };
use crate::client::crypto_manager::CryptoManager;
use crate::db::get_all_store_objects;
use crate::models::{MyBalance, MyNetwork, MyWallet};
use crate::{db, log};
use idb::Query;
use solana_sdk::native_token::sol_to_lamports;
use solana_sdk::pubkey::Pubkey;
use solana_sdk::signature::{Keypair, Signature};
use solana_sdk::signer::Signer;
use solana_sdk::system_transaction;
use std::str::FromStr;
use wasm_bindgen::JsValue;
use wasm_client_solana::prelude::{FutureExt, TryFutureExt};
use wasm_client_solana::{ClientError, ClientResult, SolanaRpcClient};
// here go functions to export

mod crypto_manager;

pub async fn get_networks() -> Vec<MyNetwork> {
    db::get_all_store_objects::<MyNetwork>("networks")
        .await
        .unwrap_or(Vec::new())
}
pub async fn get_networks_async() -> Result<JsValue, JsValue> {
    db::get_all_store_objects::<MyNetwork>("networks")
        .await
        .map(|v| serde_wasm_bindgen::to_value(&v).unwrap())
        .map_err(|e| serde_wasm_bindgen::to_value(&e).unwrap())
}

/// creates a wallet,
/// returns its pubkey
pub async fn create_wallet(
    wallet_name: String,
    wallet_store_password: String,
) -> ClientResult<JsValue> {
    let network_address = get_active_network().await.map(|n| n.address());
    if let None = network_address {
        return Err(ClientError::Other("Can't get active network".to_string()));
    }
    let client = SolanaRpcClient::new(network_address.unwrap().as_str());
    let keypair = Keypair::new();
    let crypto = CryptoManager::new(wallet_store_password.clone());
    let new_wallet = MyWallet {
        name: wallet_name,
        pubkey: keypair.pubkey().to_string(),
        keypair: crypto.encrypt(keypair.to_base58_string()),
        account_info: None,
    };
    let added = db::add_object("wallets", new_wallet).await;
    // log(format!("added: {:?}", added).as_str());
    Ok(JsValue::from_str(keypair.pubkey().to_string().as_str()))
}

pub async fn get_wallets() -> Vec<MyWallet> {
    let mut wallets: Vec<MyWallet> = db::get_all_store_objects::<MyWallet>("wallets")
        .await
        .unwrap_or(Vec::new());
    for wallet in wallets.iter_mut() {
        //get account balance
        wallet.account_info = Some(
            get_balance(&wallet.pubkey.as_str())
                .await
                .unwrap_or_default(),
        );
    }
    wallets
}

pub async fn get_active_network() -> Option<MyNetwork> {
    // db::get_store_object::<MyNetwork>("networks", "active", Query::Key(JsValue::from_bool(true)))
    //     .await
    //     .ok()
    //     .flatten()

    db::get_all_store_objects::<MyNetwork>("networks")
        .await
        .unwrap_or(Vec::new())
        .into_iter()
        .find(|n| n.active)
}

pub async fn set_active_network(network_name: String) -> ClientResult<Option<MyNetwork>> {
    let last_active_network = get_active_network().await;
    let changing_network = db::get_store_object::<MyNetwork>(
        "networks",
        "network_name",
        Query::Key(JsValue::from_str(&network_name)),
    )
    .await?;
    if last_active_network.is_none() || changing_network.is_none() {
        Err(ClientError::Other(
            "Can't get active network or network to be set active".to_string(),
        ))
    } else {
        let mut last_active_network = last_active_network.unwrap();
        let id = last_active_network.id;
        last_active_network.active = false;
        db::update_object("networks", last_active_network, Some(&JsValue::from(id))).await?;
        let mut changing_network = changing_network.unwrap();
        changing_network.active = true;
        let id = changing_network.id;
        db::update_object("networks", changing_network, Some(&JsValue::from(id))).await?;
        Ok(get_active_network().await)
    }
}

pub async fn get_account_info(for_pubkey: &str) -> String {
    let network_name = get_active_network().await.map(|n| n.address());
    let client = SolanaRpcClient::new(network_name.unwrap().as_str()); // FIXME

    let address = Pubkey::from_str(for_pubkey).unwrap();
    // log("requesting airdrop");
    // client
    //     .request_airdrop(&address, sol_to_lamports(1.0))
    //     .await.unwrap();

    let account = client.get_account(&address).await;
    // let drop = client.request_airdrop(&address, sol_to_lamports(1.0)).await;
    format!("{account:#?}") // FIXME
}

pub async fn get_balance(for_pubkey: &str) -> ClientResult<MyBalance> {
    let network_name = get_active_network().await.map(|n| n.address());
    if let Some(network) = network_name {
        let client = SolanaRpcClient::new(network.as_str());
        let address = Pubkey::from_str(for_pubkey).unwrap();
        let balance = client.get_balance(&address).await?;
        let tokens = client.get_token_account_balance(&address).await?;
        Ok(MyBalance {
            balance: Some(balance),
            tokens: Some(tokens),
        })
    } else {
        Err(ClientError::Other("Can't get active network".to_string()))
    }
}

pub async fn send_sol(
    from_pubkey: &str,
    to_pubkey: &str,
    sol: f64,
    wallet_store_password: String,
) -> ClientResult<Signature> {
    let wallets = get_wallets().await;
    let wallet = wallets.iter().filter(|n| n.pubkey.eq(from_pubkey)).next();
    if let Some(wallet_from_db) = wallet {
        //decrypt
        let from_keypair = Keypair::from_base58_string(
            CryptoManager::decrypt(wallet_store_password, wallet_from_db.keypair.clone()).as_str(),
        );

        let network_name = get_active_network().await.map(|n| n.address());
        if let None = network_name {
            return Err(ClientError::Other("Can't get active network".to_string()));
        }
        let client = SolanaRpcClient::new(network_name.unwrap().as_str());
        let latest_blockhash = client.get_latest_blockhash().await?;
        let to_pubkey = Pubkey::from_str(to_pubkey).unwrap();
        let tx = system_transaction::transfer(
            &from_keypair,
            &to_pubkey,
            sol_to_lamports(sol),
            latest_blockhash,
        );
        let signature = client.send_and_confirm_transaction(&tx.into()).await?;
        Ok(signature)
    } else {
        Err(ClientError::Other(
            "Can't find wallet to send from".to_string(),
        ))
    }
}

pub async fn request_airdrop(to_pubkey: &str, sol_quantity: f64) -> ClientResult<Signature> {
    let network_name = get_active_network().await.map(|n| n.address());
    if let None = network_name {
        return Err(ClientError::Other("Can't get active network".to_string()));
    }
    let client = SolanaRpcClient::new(network_name.unwrap().as_str());
    let address = Pubkey::from_str(to_pubkey);
    if let Ok(address) = address {
        client
            .request_airdrop(&address, sol_to_lamports(sol_quantity))
            .await
    } else {
        Err(ClientError::Other("Can't find address".to_string()))
    }
}

pub async fn seed_initial_data(wallet_store_password: String) {
    log("seed_initial_data");
    let database = db::open_database()
        .await
        .inspect_err(|err| log(&format!("error opening db: {:?}", err)));
    if let Ok(db) = database {
        db::try_seed_networks(&db).await.unwrap();
    } else {
        let db = db::create_database()
            .await
            .inspect_err(|e| log(format!("error creating db {:?}", e).as_str()));
        if let Ok(db) = db {
            db::try_seed_networks(&db).await.unwrap();
        } else {
            log("Unable to create database");
        }
    }
    // let networks = get_networks().await;
    // log(format!("(seed_initial_data) networks: {:#?}", networks).as_str());

    log("creating wallets");
    // create test wallets if they don't exist in the db
    let wallets = get_all_store_objects::<MyWallet>("wallets").await;
    let mut existing_names = match wallets {
        Ok(wallets_vec) => wallets_vec
            .iter()
            .map(|wallet| wallet.name.clone())
            .collect::<Vec<String>>(),
        Err(_) => Vec::new(),
    };
    log(format!("wallets in db: {:?}", existing_names).as_str());
    //up to 4 pcs
    let missing_wallets_count = 4 - existing_names.len();

    let mut created_wallets_count = 0;
    for _ in 0..missing_wallets_count {
        //check if the name is free
        let mut idx = 0;
        let mut wallet_name = format!("test-wallet-{}", idx);
        while existing_names.contains(&wallet_name) {
            idx += 1;
            wallet_name = format!("test-wallet-{}", idx);
        }
        //create wallet
        let wallet_pubkey = create_wallet(wallet_name.clone(), wallet_store_password.clone()).await;
        match wallet_pubkey {
            Ok(wallet) => {
                created_wallets_count += 1;
                existing_names.push(wallet_name);
                //request airdrop of 5 SOL
                let pubkey = wallet.as_string().unwrap();
                let faucet = request_airdrop(pubkey.as_str(), 5.).await;
                match faucet {
                    Ok(_) => {
                        log(&format!("faucet successfully requested for {}", pubkey));
                    }
                    Err(e) => {
                        log(&format!("Failed to request airdrop to {pubkey}: {e}"));
                    }
                }
            }
            Err(e) => {
                log(format!("Failed to create wallet {wallet_name}: {}", e).as_str());
            }
        }
    }
    log(&format!(
        "seed_initial_data end, created {created_wallets_count} out of {missing_wallets_count} wallets"
    ));
}
