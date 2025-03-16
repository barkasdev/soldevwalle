use crate::log;
use crate::models::MyNetwork;
use idb::{
    Database, DatabaseEvent, Error, Factory, IndexParams, KeyPath, ObjectStoreParams, Query,
    TransactionMode,
};
use serde::de::DeserializeOwned;
use serde::Serialize;
use wasm_bindgen::JsValue;
use wasm_client_solana::prelude::Wallet;
use wasm_client_solana::{ClientError, ClientResult};

const IDB_VERSION: Option<u32> = None;

pub async fn open_database() -> ClientResult<Database> {
    let factory = Factory::new().map_err(|e| ClientError::Other(e.to_string()))?;
    factory
        .open("soldevwalle", IDB_VERSION)
        .inspect_err(|e| log(format!("error opening database: {:?}", e).as_str()))
        .unwrap()
        .await
        .map_err(|e| ClientError::Other(e.to_string()))
}
pub async fn create_database() -> Result<Database, Error> {
    log("create database");
    // Get a factory instance from global scope
    let factory = Factory::new()?;

    factory.delete("soldevwalle")?;

    // Create an open request for the database
    let mut open_request = factory.open("soldevwalle", IDB_VERSION)?;

    // Add an upgrade handler for database
    open_request.on_upgrade_needed(|event| {
        // Get database instance from event
        let database = event.database().unwrap();
        let old_version = event.old_version();
        let new_version = event.new_version();
        log(format!(
            "upgrade needed. old db version: {:?}, new db version: {:?}",
            old_version, new_version
        )
        .as_str());

        // if old_version < 1 {
        //     // Initial setup for version 1
        //     db.create_object_store("store1")?;
        // }
        //
        // if old_version < 2 {
        //     // Upgrade to version 2
        //     db.create_object_store("store2")?;
        // }

        // Prepare object store params
        let mut store_params = ObjectStoreParams::new();
        store_params.auto_increment(true);
        store_params.key_path(Some(KeyPath::new_single("id")));

        // Create object stores
        // TODO use network name etc. as keys
        let networks_store = database
            .create_object_store("networks", store_params.clone())
            .unwrap();
        let mut active_index_params = IndexParams::new();
        active_index_params.multi_entry(true);
        // active_index_params.unique(true);
        networks_store
            .create_index(
                "active",
                KeyPath::new_single("active"),
                Some(active_index_params.clone()),
            )
            .unwrap();
        networks_store
            .create_index(
                "network_name",
                KeyPath::new_single("name"),
                Some(active_index_params.clone()),
            )
            .unwrap();

        log(&format!("[save] networks store created: {:?}", networks_store));
        let wallets_store = database
            .create_object_store("wallets", store_params.clone())
            .unwrap();

        // // Prepare index params
        // let mut index_params = IndexParams::new();
        // index_params.unique(true);
        //
        // // Create index on object store
        // store
        //     .create_index("email", KeyPath::new_single("email"), Some(index_params))
        //     .unwrap();
    });

    // `await` open request
    let result_db = open_request.await;
    result_db
}

pub async fn try_seed_data(db: &Database) -> Result<(), Error> {
    let hardcoded_networks = vec![
        MyNetwork::new(
            String::from("DEVNET"),
            String::from("https://api.devnet.solana.com"),
            true,
        ),
        MyNetwork::new(
            String::from("TESTNET"),
            String::from("https://api.devnet.solana.com"),
            false,
        ),
        MyNetwork::new(
            String::from("MAINNET"),
            String::from("https://api.devnet.solana.com"),
            false,
        ),
        MyNetwork::new(
            String::from("LOCALNET"),
            String::from("https://api.devnet.solana.com"),
            false,
        ),
        MyNetwork::new(
            String::from("DEBUG"),
            String::from("https://api.devnet.solana.com"),
            false,
        ),
    ];
    for network in &hardcoded_networks {
        let store_name = "networks";
        let transaction = db.transaction(&[store_name], TransactionMode::ReadWrite)?;
        let store = transaction
            .object_store(store_name)
            .inspect_err(|e| log(format!("networks store error: {:?}", e).as_str()))?;
        let serialized_value = serde_wasm_bindgen::to_value(&network).unwrap();
        let _id = store.add(&serialized_value, None)?.await;
        match _id {
            Ok(_) => {
                transaction.commit()?.await?;
            }
            Err(_) => {
                log(&format!("[error] store {} not found", store_name));
            }
        }
    }
    Ok(())
}

pub fn parse_object<O>(db_data: &JsValue) -> Option<O>
where
    O: DeserializeOwned,
{
    // log(&format!("[parse_object] object: {:?}", db_data));
    // serde_json::from_str::<O>(db_data.as_string().unwrap_or_default().as_str()).ok()

    serde_wasm_bindgen::from_value(db_data.to_owned()).ok()
}

pub(crate) async fn get_all_store_objects<O>(store_name: &str) -> ClientResult<Vec<O>>
where
    O: DeserializeOwned,
{
    // let database = create_database().await?;
    let database = open_database().await?;
    let transaction = database
        .transaction(&[store_name], TransactionMode::ReadOnly)
        .map_err(|e| ClientError::Other(e.to_string()))?;
    let store = transaction
        .object_store(store_name)
        .map_err(|e| ClientError::Other(e.to_string()))?;
    let store_request = store
        .get_all(None, None)
        .map_err(|e| ClientError::Other(e.to_string()))?;
    Ok(store_request
        .await
        .map_err(|e| ClientError::Other(e.to_string()))?
        .iter()
        .flat_map(|r| parse_object::<O>(r))
        .collect::<Vec<O>>())
}

pub(crate) async fn get_store_object<O>(
    store_name: &str,
    index_name: &str,
    query: Query,
) -> ClientResult<Option<O>>
where
    O: DeserializeOwned,
{
    let database = open_database().await?;
    let transaction = database
        .transaction(&[store_name], TransactionMode::ReadOnly)
        .map_err(|e| ClientError::Other(e.to_string()))?;
    let store = transaction
        .object_store(store_name)
        .map_err(|e| ClientError::Other(e.to_string()))?;
    let index = store
        .index(index_name)
        .map_err(|e| ClientError::Other(e.to_string()))?;

    let store_request = index.get(query);
    log(format!("!!!!!{:#?}", store_request).as_str());
    Ok(store_request
        .map_err(|e| ClientError::Other(e.to_string()))?
        .await
        .map_err(|e| ClientError::Other(e.to_string()))?
        .map(|r| parse_object::<O>(&r))
        .flatten())
}

pub async fn add_object<O>(store_name: &str, entity: O) -> ClientResult<JsValue>
where
    O: Serialize,
{
    // let database = create_database().await?;
    let database = open_database().await?;
    let transaction = database
        .transaction(&[store_name], TransactionMode::ReadWrite)
        .map_err(|e| ClientError::Other(e.to_string()))?;
    let store = transaction
        .object_store(store_name)
        .map_err(|e| ClientError::Other(e.to_string()))?;
    let serialized_value = serde_wasm_bindgen::to_value(&entity)
        // .map_err(|e| idb::Error::UnexpectedJsType(&e.to_string(), &entity))
        .unwrap();
    let id = store
        .add(
            // &entity.serialize(&Serializer::json_compatible()).unwrap(),
            &serialized_value, // FIXME
            None,
        )
        .unwrap()
        .await
        .map_err(|e| ClientError::Other(e.to_string()))?;
    transaction
        .commit()
        .map_err(|e| ClientError::Other(e.to_string()))?
        .await
        .map_err(|e| ClientError::Other(e.to_string()))?;

    Ok(id)
}

pub async fn update_object<O>(
    store_name: &str,
    entity: O,
    key: Option<&JsValue>,
) -> ClientResult<JsValue>
where
    O: Serialize,
{
    // let database = create_database().await?;
    let database = open_database()
        .await
        .map_err(|e| ClientError::Other(e.to_string()))?;
    let transaction = database
        .transaction(&[store_name], TransactionMode::ReadWrite)
        .map_err(|e| ClientError::Other(e.to_string()))?;
    let store = transaction
        .object_store(store_name)
        .map_err(|e| ClientError::Other(e.to_string()))?;
    let serialized_value = serde_wasm_bindgen::to_value(&entity)
        // .map_err(|e| idb::Error::UnexpectedJsType(&e.to_string(), &entity))
        .unwrap();
    let id = store
        .put(&serialized_value, key)
        .unwrap()
        .await
        .map_err(|e| ClientError::Other(e.to_string()))?;
    transaction
        .commit()
        .map_err(|e| ClientError::Other(e.to_string()))?
        .await
        .map_err(|e| ClientError::Other(e.to_string()))?;

    Ok(id)
}
