use uuidland::inspect::{TimeSpec, UuidDetails};
use uuidland::wellknown;
use uuidland::Uuid;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub struct PartedUuid {
    pub hi: u64,
    pub lo: u64,
}

// #[wasm_bindgen]
impl PartedUuid {
    fn into_uuid(self) -> Uuid {
        Uuid::from_value((self.hi as u128) << 64 | (self.lo as u128))
    }

    fn from_uuid(uuid: Uuid) -> Self {
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
pub fn create_uuid_v1() -> Option<PartedUuid> {
    uuidland::gen::v1()
        .map(|uuid| PartedUuid::from_uuid(uuid))
        .ok()
}

#[wasm_bindgen]
pub fn create_uuid_v4() -> PartedUuid {
    PartedUuid::from_uuid(uuidland::gen::v4())
}

#[wasm_bindgen]
pub fn create_uuid_v3(name: &str, namespace: PartedUuid) -> PartedUuid {
    let uuid = uuidland::gen::v3(
        //
        name.as_bytes(),
        Some(PartedUuid::into_uuid(namespace)),
    );
    PartedUuid::from_uuid(uuid)
}

#[wasm_bindgen]
pub fn create_uuid_v5(name: &str, namespace: PartedUuid) -> PartedUuid {
    let uuid = uuidland::gen::v5(
        //
        name.as_bytes(),
        Some(PartedUuid::into_uuid(namespace)),
    );
    PartedUuid::from_uuid(uuid)
}

#[wasm_bindgen]
pub fn random_uuid_str() -> String {
    let v1 = if rand::random() {
        uuidland::gen::v1().ok()
    } else {
        None
    };

    v1.unwrap_or_else(|| uuidland::gen::v4()).to_string_hex()
}

#[wasm_bindgen]
pub fn format_uuid(p_uuid: PartedUuid) -> String {
    p_uuid.into_uuid().to_string_hex()
}

#[wasm_bindgen]
pub fn parse_uuid(s: &str) -> Option<PartedUuid> {
    Uuid::parse(s).map(PartedUuid::from_uuid).ok()
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
            name: "NS:DNS".into(),
            uuid: PartedUuid::from_uuid(wellknown::NS_DNS),
        },
        WellKnownUuid {
            name: "NS:URL".into(),
            uuid: PartedUuid::from_uuid(wellknown::NS_URL),
        },
        WellKnownUuid {
            name: "NS:OID".into(),
            uuid: PartedUuid::from_uuid(wellknown::NS_OID),
        },
        WellKnownUuid {
            name: "NS:X500".into(),
            uuid: PartedUuid::from_uuid(wellknown::NS_X500),
        },
    ]
}

/* ===================================== */
// DECODING
/* ===================================== */

#[wasm_bindgen(getter_with_clone)]
pub struct DecodeResult {
    pub p_uuid: PartedUuid,
    pub strval: String,
    pub intval: String,
    pub details: UuidDetails,
    pub timespec: TimeSpec,
}

#[wasm_bindgen]
pub fn decode_uuid(s: &str) -> Option<DecodeResult> {
    let uuid = Uuid::parse(s).ok()?;
    let details = uuid.details();
    let timespec = details.unix_time();

    Some(DecodeResult {
        strval: uuid.to_string_hex(),
        intval: uuid.value().to_string(),
        p_uuid: PartedUuid::from_uuid(uuid),
        details,
        timespec,
    })
}
