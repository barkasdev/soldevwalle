use serde::Deserialize;
use serde::Serialize;

/// Use this response type to discard the response payload
#[derive(Debug, Deserialize, Serialize)]
pub struct IgnoredData {}
