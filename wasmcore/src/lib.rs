use uuidland::inspect::UuidDetails;
use uuidland::wellknown;
use uuidland::Uuid;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub struct PartedUuid {
    hi: u64,
    lo: u64,
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
pub fn format_uuid(p_uuid: PartedUuid) -> String {
    p_uuid.into_uuid().to_string_hex()
}

#[wasm_bindgen(getter_with_clone)]
pub struct WellKnownUuid {
    pub name: String,
    pub uuid: PartedUuid,
}


#[wasm_bindgen]
pub fn wellknown_list() -> Vec<WellKnownUuid> {
    vec![
        WellKnownUuid {
            name: "NS_DNS".into(),
            uuid: PartedUuid::from_uuid(&wellknown::NS_DNS),
        },
        WellKnownUuid {
            name: "NS_URL".into(),
            uuid: PartedUuid::from_uuid(&wellknown::NS_URL),
        },
        WellKnownUuid {
            name: "NS_OID".into(),
            uuid: PartedUuid::from_uuid(&wellknown::NS_OID),
        },
        WellKnownUuid {
            name: "NS_X500".into(),
            uuid: PartedUuid::from_uuid(&wellknown::NS_X500),
        },
    ]
}
