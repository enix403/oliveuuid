use wasm_bindgen::prelude::*;
use uuidland::Uuid;
use uuidland::inspect::UuidDetails;


#[wasm_bindgen]
#[derive(Clone, Copy)]
pub struct PartedUuid {
    hi: u64,
    lo: u64
}

// #[wasm_bindgen]
impl PartedUuid {
    fn into_uuid(self) -> Uuid {
        Uuid::from_value((self.hi as u128) << 64 | (self.lo as u128))
    }

    fn from_uuid(uuid: &Uuid) -> Self {
        let value = uuid.value();
        let bytes = value.to_be_bytes();
        Self {
            // hi: (value >> 64) as u64,
            hi: u64::from_be_bytes(bytes[0..8].try_into().unwrap()),
            lo: u64::from_be_bytes(bytes[8..16].try_into().unwrap()),
        }
    }
}


#[wasm_bindgen]
pub fn create_uuid() -> PartedUuid {
    let uuid = uuidland::gen::v4();
    // This is a comment
    PartedUuid::from_uuid(&uuid)
}

#[wasm_bindgen]
pub fn get_details(p_uuid: PartedUuid) -> UuidDetails {
    p_uuid.into_uuid().details()
}

#[wasm_bindgen]
pub fn format_uuid(p_uuid: PartedUuid) -> String {
    p_uuid.into_uuid().to_string_hex()
}