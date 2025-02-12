use crate::log;
use crate::models::MyNetwork;
use idb::{
    Database, DatabaseEvent, Error, Factory, IndexParams, KeyPath, ObjectStoreParams, Query,
    TransactionMode,
};
use serde::de::DeserializeOwned;
use serde::Serialize;
use serde_json::Value;
use serde_wasm_bindgen::Serializer;
use wasm_bindgen::JsValue;
use wasm_client_solana::{ClientError, ClientResult};
use wasm_client_solana::prelude::Wallet;

pub async fn test_create_idb() -> Result<String, String> {
    // !!! deleting database every test !!!
    let _factory = Factory::new().unwrap().delete("soldevwalle");
    // !!!

    // Ok("".to_string())
    let db = create_database().await.map_err(|e| e.to_string())?;
    let added = add_data(&db).await.map_err(|e| e.to_string())?;
    let g = get_data(&db, JsValue::from_f64(3_f64))
        .await
        .map_err(|e| e.to_string())?;
    Ok(g.unwrap_or_default().to_string())
    // // Ok(db.store_names().join(","))
}

pub async fn open_database() -> ClientResult<Database> {
    let factory = Factory::new().map_err(|e| ClientError::Other(e.to_string()))?;
    factory.open("soldevwalle", None).unwrap().await.map_err(|e| ClientError::Other(e.to_string()))
}
pub async fn create_database() -> Result<Database, Error> {
    // Get a factory instance from global scope
    let factory = Factory::new()?;

    // Create an open request for the database
    let mut open_request = factory.open("soldevwalle", None).unwrap();

    // Add an upgrade handler for database
    open_request.on_upgrade_needed(|event| {
        // Get database instance from event
        let database = event.database().unwrap();

        // Prepare object store params
        let mut store_params = ObjectStoreParams::new();
        store_params.auto_increment(true);
        store_params.key_path(Some(KeyPath::new_single("id")));

        // Create object stores
        let store = database
            .create_object_store("employees", store_params.clone())
            .unwrap();
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
                Some(active_index_params),
            )
            .unwrap();
        
        log(&format!("[save] networks created: {:?}", networks_store));
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
        let store = transaction.object_store(store_name)?;
        let serialized_value = serde_wasm_bindgen::to_value(&network).unwrap();
        let _id = store.add(&serialized_value, None)?.await?;
        transaction.commit()?.await?;
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
    let transaction = database.transaction(&[store_name], TransactionMode::ReadOnly).map_err(|e| ClientError::Other(e.to_string()))?;
    let store = transaction.object_store(store_name).map_err(|e| ClientError::Other(e.to_string()))?;
    let store_request = store.get_all(None, None).map_err(|e| ClientError::Other(e.to_string()))?;
    Ok(store_request
        .await.map_err(|e| ClientError::Other(e.to_string()))?
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
    let transaction = database.transaction(&[store_name], TransactionMode::ReadOnly).map_err(|e| ClientError::Other(e.to_string()))?;
    let store = transaction.object_store(store_name).map_err(|e| ClientError::Other(e.to_string()))?;
    let index = store.index(index_name).map_err(|e| ClientError::Other(e.to_string()))?;
    
    let store_request = index.get(query);
    log(format!("!!!!!{:#?}", store_request).as_str());
    Ok(store_request.map_err(|e| ClientError::Other(e.to_string()))?
        .await.map_err(|e| ClientError::Other(e.to_string()))?
        .map(|r| parse_object::<O>(&r))
        .flatten())
}

pub async fn add_object<O>(store_name: &str, entity: O) -> ClientResult<JsValue>
where
    O: Serialize,
{
    // let database = create_database().await?;
    let database = open_database().await?;
    let transaction = database.transaction(&[store_name], TransactionMode::ReadWrite).map_err(|e| ClientError::Other(e.to_string()))?;
    let store = transaction.object_store(store_name).map_err(|e| ClientError::Other(e.to_string()))?;
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
        .await.map_err(|e| ClientError::Other(e.to_string()))?;
    transaction.commit().map_err(|e| ClientError::Other(e.to_string()))?.await.map_err(|e| ClientError::Other(e.to_string()))?;

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
    let database = open_database().await.map_err(|e| ClientError::Other(e.to_string()))?;
    let transaction = database.transaction(&[store_name], TransactionMode::ReadWrite).map_err(|e| ClientError::Other(e.to_string()))?;
    let store = transaction.object_store(store_name).map_err(|e| ClientError::Other(e.to_string()))?;
    let serialized_value = serde_wasm_bindgen::to_value(&entity)
        // .map_err(|e| idb::Error::UnexpectedJsType(&e.to_string(), &entity))
        .unwrap();
    let id = store.put(&serialized_value, key).unwrap().await.map_err(|e| ClientError::Other(e.to_string()))?;
    transaction.commit().map_err(|e| ClientError::Other(e.to_string()))?.await.map_err(|e| ClientError::Other(e.to_string()))?;

    Ok(id)
}

async fn add_data(database: &Database) -> ClientResult<JsValue> {
    // Create a read-write transaction
    let transaction = database.transaction(&["employees"], TransactionMode::ReadWrite).map_err(|e| ClientError::Other(e.to_string()))?;

    // Get the object store
    let store = transaction.object_store("employees").map_err(|e| ClientError::Other(e.to_string()))?;

    // Prepare data to add
    let employee = serde_json::json!({
        "name": "John Doe",
        "email": "john@example2.com",
    });

    // Add data to object store
    let id = store
        .add(
            &employee.serialize(&Serializer::json_compatible()).unwrap(),
            None,
        )
        .unwrap()
        .await.map_err(|e| ClientError::Other(e.to_string()))?;

    // Commit the transaction
    transaction.commit().map_err(|e| ClientError::Other(e.to_string()))?.await.map_err(|e| ClientError::Other(e.to_string()))?;

    Ok(id)
}

async fn get_data(database: &Database, id: JsValue) -> ClientResult<Option<Value>> {
    // Create a read-only transaction
    let transaction = database
        .transaction(&["employees"], TransactionMode::ReadOnly)
        .unwrap();

    // Get the object store
    let store = transaction.object_store("employees").map_err(|e| ClientError::Other(e.to_string()))?;

    // Get the stored data
    let stored_employee: Option<JsValue> = store.get(id).map_err(|e| ClientError::Other(e.to_string()))?.await.map_err(|e| ClientError::Other(e.to_string()))?;

    // Deserialize the stored data
    let stored_employee: Option<Value> = stored_employee
        .map(|stored_employee| serde_wasm_bindgen::from_value(stored_employee).unwrap());

    // Wait for the transaction to complete (alternatively, you can also commit the transaction)
    transaction.await.map_err(|e| ClientError::Other(e.to_string()))?;

    Ok(stored_employee)
}

//////////////////////////       DELI
// pub async fn test_create_deli() -> Result<String, String> {
//     let database = create_database().await.map_err(|e| format!("e1 {}", e.to_string()))?;
//     let transaction = create_write_transaction(&database).map_err(|e| format!("e2 {}", e.to_string()))?;
//     let store = Employee::with_transaction(&transaction).map_err(|e| format!("e3 {}", e.to_string()))?;
//
//     let id = store
//         .add(&AddEmployee {
//             name: "Alice2".to_string(),
//             email: "alice@example.com".to_string(),
//             age: 26,
//         })
//         .await
//         .map_err(|e| format!("e4 {}", e.to_string()))?;
//
//     transaction.commit().await.map_err(|e| format!("e5 {}", e.to_string()))?;
//
//     let transaction = create_read_transaction(&database).map_err(|e| format!("e6 {}", e.to_string()))?;
//     let store = Employee::with_transaction(&transaction).map_err(|e| format!("e7 {}", e.to_string()))?;
//
//     let employee = store.get(&id).await.map_err(|e| format!("e8 {}", e.to_string()))?;
//     let employee = employee.unwrap();
//     Ok(format!("{} {}", employee.name, employee.age))
// }
//
// pub async fn test_database() -> Result<String, String> {
//     let db = create_database().await.map_err(|e| format!("e1 {}", e.to_string()))?;
//     // //writing
//     let tx = create_write_transaction(&db).map_err(|e| format!("e2 {}", e.to_string()))?;
//     let empl_id = add_employee(
//         &tx,
//         &AddEmployee {
//             name: String::from("Trillian"),
//             email: String::from("zafod@beeblebrox.com"),
//             age: 27,
//         },
//     )
//     .await
//         .map_err(|e| format!("e3 {}", e.to_string()))?;
//     let written = commit_transaction(tx).await.map_err(|e| format!("e4 {}", e.to_string()))?;
//
//     //reading
//     let tx = create_read_transaction(&db).map_err(|e| e.to_string())?;
//     let empl = get_employee(&tx, empl_id).await.map_err(|e| e.to_string())?;
//
//     Ok(format!("{:#?}", empl).to_string())
// }
//
// async fn create_database() -> Result<Database, Error> {
//     Database::builder("soldevwalle3")
//         .version(3)
//         .add_model::<Employee>()
//         .build()
//         .await
// }
//
// fn create_read_transaction(database: &Database) -> Result<Transaction, Error> {
//     database.transaction().with_model::<Employee>().build()
// }
//
// fn create_write_transaction(database: &Database) -> Result<Transaction, Error> {
//     database
//         .transaction()
//         .writable()
//         .with_model::<Employee>()
//         .build()
// }
//
// async fn commit_transaction(transaction: Transaction) -> Result<TransactionResult, Error> {
//     transaction.commit().await
// }
//
// async fn add_employee(transaction: &Transaction, employee: &AddEmployee) -> Result<u32, Error> {
//     Employee::with_transaction(transaction)?.add(employee).await
// }
//
// async fn get_employee(transaction: &Transaction, id: u32) -> Result<Option<Employee>, Error> {
//     Employee::with_transaction(transaction)?.get(&id).await
// }
//
// async fn get_all_employees(transaction: &Transaction) -> Result<Vec<Employee>, Error> {
//     // NOTE: Here `..` (i.e., `RangeFull`) means fetch all values from store
//     Employee::with_transaction(transaction)?
//         .get_all(.., None)
//         .await
// }
//
// async fn get_employees_with_bounds(
//     transaction: &Transaction,
//     from_id: u32,
//     to_id: u32,
// ) -> Result<Vec<Employee>, Error> {
//     Employee::with_transaction(transaction)?
//         .get_all(&from_id..=&to_id, None)
//         .await
// }
