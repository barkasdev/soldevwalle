use crate::client::get_networks;
use crate::log;
use crate::models::MyNetwork;
use idb::event::VersionChangeEvent;
use idb::{
    Database, DatabaseEvent, Error, Factory, IndexParams, KeyPath, ObjectStoreParams, Query,
    Request, TransactionMode,
};
use serde::de::DeserializeOwned;
use serde::Serialize;
use serde_wasm_bindgen::to_value;
use wasm_bindgen::JsValue;
use wasm_client_solana::prelude::Wallet;
use wasm_client_solana::{ClientError, ClientResult};

const IDB_VERSION: Option<u32> = Some(1);

pub async fn open_database() -> ClientResult<Database> {
    let factory = Factory::new().map_err(|e| ClientError::Other(e.to_string()))?;
    let mut open_request = factory
        .open("soldevwalle", IDB_VERSION)
        .inspect_err(|e| log(format!("error opening database: {:?}", e).as_str()))
        .unwrap();
    // .await
    // .map_err(|e| ClientError::Other(e.to_string()))?;
    open_request.on_upgrade_needed(|event: VersionChangeEvent| {
        // Get database instance from event
        let database = event.database().unwrap();
        let old_version = event.old_version();
        let new_version = event.new_version();
        log(format!(
            "upgrade needed. old db version: {:?}, new db version: {:?}",
            old_version, new_version
        )
        .as_str());

        if !object_store_exists(&database, "networks") {
            create_networks_store(&database);
            // try_seed_networks(&database).await.inspect_err(|e| {
            //     log(format!("error creating networks database: {:?}", e).as_str())
            // });
        }

        if !object_store_exists(&database, "wallets") {
            create_wallets_store(&database);
        }

        // if old_version < 1 {
        //     // Initial setup for version 1
        //     db.create_object_store("store1")?;
        // }
        //
        // if old_version < 2 {
        //     // Upgrade to version 2
        //     db.create_object_store("store2")?;
        // }
    });
    open_request
        .await
        .map_err(|e| ClientError::Other(e.to_string()))
}

fn object_store_exists(db: &Database, store_name: &str) -> bool {
    db.store_names().contains(&store_name.to_owned())
}

pub async fn create_database() -> Result<Database, Error> {
    log("creating database");
    // Get a factory instance from global scope
    let factory = Factory::new()?;

    factory.delete("soldevwalle")?;
    log("database deleted");

    // Create an open request for the database
    let mut open_request = factory.open("soldevwalle", IDB_VERSION)?;

    // Add an upgrade handler for database
    open_request.on_upgrade_needed(|event: VersionChangeEvent| {
        // Get database instance from event
        let database = event.database().unwrap();
        let old_version = event.old_version();
        let new_version = event.new_version();
        log(format!(
            "upgrade needed. old db version: {:?}, new db version: {:?}",
            old_version, new_version
        )
        .as_str());

        if !object_store_exists(&database, "networks") {
            create_networks_store(&database);
            // try_seed_networks(&database).await.inspect_err(|e| {
            //     log(format!("error creating networks database: {:?}", e).as_str())
            // });
        }

        if !object_store_exists(&database, "wallets") {
            create_wallets_store(&database);
        }

        // if old_version < 1 {
        //     // Initial setup for version 1
        //     db.create_object_store("store1")?;
        // }
        //
        // if old_version < 2 {
        //     // Upgrade to version 2
        //     db.create_object_store("store2")?;
        // }
    });
    // log("try seed networks in create_database");
    // let _ = try_seed_networks().await;
    log("database created");
    open_request.await
}

fn create_wallets_store(database: &Database) {
    let mut id_key_store_params = ObjectStoreParams::new();
    id_key_store_params.auto_increment(true);
    id_key_store_params.key_path(Some(KeyPath::new_single("name"))); // id
    let wallets_store = database
        .create_object_store("wallets", id_key_store_params.clone())
        .unwrap();
    let index_params = IndexParams::new();
    wallets_store
        .create_index(
            "name",
            KeyPath::new_single("name"),
            Some(index_params.clone()),
        )
        .unwrap();
    wallets_store
        .create_index(
            "pubkey",
            KeyPath::new_single("pubkey"),
            Some(index_params.clone()),
        )
        .unwrap();
    log("wallets store created");
}

fn create_networks_store(database: &Database) {
    let mut name_key_store_params = ObjectStoreParams::new();
    name_key_store_params.auto_increment(false);
    name_key_store_params.key_path(Some(KeyPath::new_single("name")));

    let networks_store = database
        .create_object_store("networks", name_key_store_params.clone())
        .unwrap();
    let mut active_index_params = IndexParams::new();
    active_index_params.multi_entry(false);
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
    log("networks store created");
}

pub async fn try_seed_networks() -> Result<(), Error> {
    // log("try seed networks");
    let db = open_database()
        .await
        .map_err(|e| Error::AddFailed(JsValue::from(e.to_string())))
        .inspect_err(|err| log(&format!("error opening db: {:?}", err)))?;
    let network_addresses_in_db = get_all_store_objects::<MyNetwork>("networks")
        .await
        .unwrap_or(Vec::new())
        .iter()
        .map(|n| n.address())
        .collect::<Vec<_>>();
    let hardcoded_networks = vec![
        MyNetwork::new(
            // 0,
            String::from("DEVNET"),
            String::from("https://api.devnet.solana.com"),
            true,
        ),
        MyNetwork::new(
            // 1,
            String::from("TESTNET"),
            String::from("https://api.devnet.solana.com"),
            false,
        ),
        MyNetwork::new(
            // 2,
            String::from("MAINNET"),
            String::from("https://api.devnet.solana.com"),
            false,
        ),
        MyNetwork::new(
            // 3,
            String::from("LOCALNET"),
            String::from("https://api.devnet.solana.com"),
            false,
        ),
        MyNetwork::new(
            // 4,
            String::from("DEBUG"),
            String::from("https://api.devnet.solana.com"),
            false,
        ),
    ];
    let hardcoded_networks = hardcoded_networks
        .iter()
        .filter(|&hn| !network_addresses_in_db.contains(&hn.address()))
        .collect::<Vec<&MyNetwork>>();
    log(format!("Adding missing networks: {:?}", hardcoded_networks).as_str());
    let store_name = "networks";
    for network in &hardcoded_networks {
        let transaction = db.transaction(&[store_name], TransactionMode::ReadWrite)?;
        let store = transaction
            .object_store(store_name)
            .inspect_err(|e| log(format!("networks store error: {:?}", e).as_str()))?;

        let serialized_value = serde_wasm_bindgen::to_value(&network).unwrap();

        // let mut no_id_value: serde_json::Value = from_value(serialized_value).unwrap();
        // no_id_value.as_object_mut().unwrap().remove("id");
        //
        // let _id = store
        //     .add(&to_value(&no_id_value).unwrap(), None)?
        //     .await
        //     .inspect_err(|e| {
        //         log(format!("error adding network '{:?}': {:?}", &network, e).as_str())
        //     });

        store.add(
            &serialized_value,
            None, /*Some(&to_value(&network.name()).unwrap())*/
        )?;
        // store.add(&no_id_value, None)?;

        transaction.commit()?.await.inspect_err(|e| {
            log(format!("error committing network '{:?}'", e).as_str());
        })?;
    }
    log("try seed networks end");
    let _networks = get_networks().await;
    log(format!("networks from db: {:?}", _networks).as_str());
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
        // .inspect(|elm|log(format!("get all store object {:?}", elm.as_string()).as_str()))
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

    let store_request = index.get(query.clone());
    // log(format!("!!!!!({:#?} from {}) {:#?}", &query, store_name, store_request).as_str());
    Ok(store_request
        .map_err(|e| ClientError::Other(e.to_string()))?
        .await
        .map_err(|e| ClientError::Other(e.to_string()))?
        .and_then(|r| parse_object::<O>(&r)))
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
    let serialized_value = to_value(&entity)?;
    log(format!("update object '{:?}'", serialized_value).as_str());
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

pub async fn delete_store_object(
    store_name: &str,
    id_query: Query,
) -> ClientResult<()> {
    let database = open_database().await?;
    let transaction = database
        .transaction(&[store_name], TransactionMode::ReadWrite)
        .map_err(|e| ClientError::Other(e.to_string()))?;
    let store = transaction
        .object_store(store_name)
        .map_err(|e| ClientError::Other(e.to_string()))?;
    let id = store
        .delete(id_query)
        .map_err(|e| ClientError::Other(e.to_string()))
        .inspect_err(|e| log("delete object failure"))?;
    transaction
        .commit()
        .map_err(|e| ClientError::Other(e.to_string()))?
        .await
        .map_err(|e| ClientError::Other(e.to_string()))?;
    Ok(())
}
