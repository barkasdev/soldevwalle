use aes_gcm::aead::Aead;
use aes_gcm::{Aes256Gcm, Key, KeyInit, Nonce};
use hex::{decode, encode};
use pbkdf2::pbkdf2_hmac;
use sha2::Sha256;
use wasm_bindgen::prelude::*;
use crate::log;

const PBKDF2_ITERATIONS: u32 = 100_000;
const KEY_SIZE: usize = 32; // 256-bit key
const SALT_SIZE: usize = 16; // 128-bit salt

#[wasm_bindgen]
pub struct CryptoManager {
    key: Key<Aes256Gcm>,
    salt: [u8; SALT_SIZE],
}

#[wasm_bindgen]
impl CryptoManager {
    #[wasm_bindgen(constructor)]
    pub fn new(password: String) -> CryptoManager {
        log("create crypto manager");
        let mut salt = [0u8; SALT_SIZE];
        getrandom::getrandom(&mut salt)
            .inspect_err(|err| {log(&format!("getrandom failed: {:?}", err))})
            .expect("Failed to generate salt");

        let mut key_bytes = [0u8; KEY_SIZE];
        pbkdf2_hmac::<Sha256>(
            password.as_bytes(),
            &salt,
            PBKDF2_ITERATIONS,
            &mut key_bytes,
        );

        CryptoManager {
            key: Key::<Aes256Gcm>::from_slice(&key_bytes).clone(),
            salt,
        }
    } //<Aes256Gcm as KeySizeUser>::KeySize

    #[wasm_bindgen]
    pub fn encrypt(&self, data: String) -> String {
        let cipher = Aes256Gcm::new(&self.key);
        let mut iv = [0u8; 12];
        getrandom::getrandom(&mut iv).expect("Failed to generate IV");

        let nonce = Nonce::from_slice(&iv);
        let encrypted = cipher
            .encrypt(nonce, data.as_bytes())
            .expect("Encryption failed");

        format!("{}:{}:{}", encode(self.salt), encode(iv), encode(encrypted))
    }

    #[wasm_bindgen]
    pub fn decrypt(password: String, encrypted_data: String) -> String {
        let cipher_data: Vec<&str> = encrypted_data.split(':').collect();
        if cipher_data.len() != 3 {
            return "Invalid encrypted data format".to_string();
        }

        let salt = decode(cipher_data[0]).expect("Invalid salt encoding");
        let iv = decode(cipher_data[1]).expect("Invalid IV encoding");
        let encrypted = decode(cipher_data[2]).expect("Invalid encrypted data encoding");

        let mut key_bytes = [0u8; KEY_SIZE];
        pbkdf2_hmac::<Sha256>(
            password.as_bytes(),
            &salt,
            PBKDF2_ITERATIONS,
            &mut key_bytes,
        );

        let key = Key::<Aes256Gcm>::from_slice(&key_bytes);
        let cipher = Aes256Gcm::new(key);
        let nonce = Nonce::from_slice(&iv);

        match cipher.decrypt(nonce, encrypted.as_ref()) {
            Ok(decrypted) => String::from_utf8(decrypted).unwrap(),
            Err(_) => "Decryption failed".to_string(),
        }
    }
}
