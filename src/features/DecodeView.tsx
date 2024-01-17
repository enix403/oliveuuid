import { wasmCore } from "@/tunnel";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { ReactNode, useState } from "react";

type DecodeRow = {
  name: string;
  value: ReactNode;
};

function mute(content: string): ReactNode {
  return (
    <span color="gray" className="ml-1 italic text-[rgb(158,150,137)]">
      {content}
    </span>
  );
}

function getVersionString(version: number) {
  let verstrs = {
    1: "(time and node based)",
    3: "(name based, MD5)",
    4: "(random data based)",
    5: "(name based, SHA-1)",
  };

  let versionStr = verstrs[version] || "(unknown)";

  return (
    <>
      {version} {mute(versionStr)}
    </>
  );
}

function getVariantString(variantOctet: number) {
  let high = variantOctet >> 4;

  // 0 - 7 | 0xxx | reserved (NCS backward compatible)
  // 8 - b | 10xx | DCE 1.1, ISO/IEC 11578:1996
  // c - d | 110x | reserved (Microsoft GUID)
  // e - f | 111x | reserved (future use)

  if (high <= 7) return "0xxx - reserved (NCS backward compatible)";
  if (high <= 11) return "10xx - DCE 1.1, ISO/IEC 11578:1996";
  if (high <= 13) return "110x - reserved (Microsoft GUID)";
  else return "111x - reserved (future use)";
}

function toBytes(number: bigint | number, numBytes: number): number[] {
  let bytes: number[] = [];

  let mask: number | bigint = 0xff;
  let shift: number | bigint = 8;
  if (typeof number === "bigint") {
    mask = BigInt(mask);
    shift = BigInt(shift);
  }

  for (let i = 0; i < numBytes; ++i) {
    // @ts-ignore
    let byte = Number(number & mask);
    // @ts-ignore
    number = number >> shift;
    bytes.push(byte);
  }

  return bytes.reverse();
}

function formatTime(spec: wasmCore.TimeSpec) {
  let d = new Date(Number(spec.seconds) * 1000);

  let year = d.getUTCFullYear().toString().padStart(4, "0");
  let month = d.getUTCMonth().toString().padStart(2, "0");
  let date = d.getUTCDate().toString().padStart(2, "0");
  let hours = d.getUTCHours().toString().padStart(2, "0");
  let mins = d.getUTCMinutes().toString().padStart(2, "0");
  let secs = d.getUTCSeconds().toString().padStart(2, "0");

  let microseconds = spec.microseconds.toString().padStart(6, "0");
  let nanoseconds = spec.nanoseconds / 100;

  return `${year}-${month}-${date}T${hours}:${mins}:${secs}.${microseconds}.${nanoseconds}Z`;
}

function formatNode(number: bigint) {
  let bytes = toBytes(number, 6);

  let hexParts = bytes.map((byte) => byte.toString(16).padStart(2, "0"));
  let nodeStr = hexParts.join(":");

  let octet = bytes[0];

  let range = octet & 0x02 ? "local" : "global";
  let cast = octet & 0x01 ? "multicast" : "unicast";

  let muted = `(${range} ${cast})`;

  return (
    <>
      {nodeStr} {mute(muted)}
    </>
  );
}

function createContentRows(result: wasmCore.DecodeResult): DecodeRow[] {
  let { version, variant } = result.details;

  let vhigh = variant >> 4;

  let rfcVariant = vhigh >= 8 && vhigh <= 11;

  if (version === 1 && rfcVariant) {
    return [
      { name: "Contents - Clock", value: result.details.clock_seq },
      { name: "Contents - Time", value: formatTime(result.timespec) },
      { name: "Contents - Node", value: formatNode(result.details.node) },
    ];
  }

  let { hi, lo } = result.p_uuid;
  let contentBytes = [...toBytes(hi, 8), ...toBytes(lo, 8)];

  let contentStr = contentBytes
    .map((byte) => byte.toString(16).toUpperCase().padStart(2, "0"))
    .join(":");

  let debugInfo: string;
  if (!rfcVariant) {
    debugInfo = "not decipherable: unknown UUID variant";
  } else if (version === 3) {
    debugInfo = "not decipherable: MD5 message digest only";
  } else if (version === 4) {
    debugInfo = "no semantics: random data only";
  } else if (version === 5) {
    debugInfo = "not decipherable: truncated SHA-1 message digest only";
  } else {
    debugInfo = "not decipherable: unknown UUID version";
  }

  debugInfo = `(${debugInfo})`;

  return [
    {
      name: "Contents",
      value: (
        <>
          {contentStr}
          <br />
          {mute(debugInfo)}
        </>
      ),
    },
  ];
}

export function DecodeView() {
  const [uuid, setUuid] = useState("");
  const [invalidUuid, setInvalidUuid] = useState(false);
  let [rows, setRows] = useState<DecodeRow[]>([]);

  function handleDecode(event: React.SyntheticEvent) {
    event.preventDefault();
    event.stopPropagation();

    let result = wasmCore.decode_uuid(uuid);

    if (result === undefined) {
      setInvalidUuid(true);
      return;
    }

    setRows([
      //
      { name: "Standard String Format", value: result.strval },
      { name: "Single Integer Value", value: result.intval },
      { name: "Version", value: getVersionString(result.details.version) },
      { name: "Variant", value: getVariantString(result.details.variant) },
      ...createContentRows(result),
    ]);

    result.free();
  }

  return (
    <>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Decode UUID
      </Typography>

      <form onSubmit={handleDecode}>
        <div className="w-full md:max-w-[650px]">
          <TextField
            label="Enter UUID"
            variant="outlined"
            helperText={invalidUuid ? "Failed to parse this UUID" : undefined}
            error={!!invalidUuid}
            InputProps={{ className: "!font-['Fira_Code'] !font-medium" }}
            fullWidth
            value={uuid}
            onChange={(event) => {
              setUuid(event.target.value);
              setInvalidUuid(false);
            }}
          />
        </div>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="caption">
            This must be a valid UUID in the format{" "}
            <Typography display="inline" variant="inherit" color="primary.main">
              00000000-0000-0000-0000-000000000000
            </Typography>
          </Typography>
        </Box>

        <Button
          color="primary"
          variant="contained"
          sx={{ marginBottom: 2 }}
          type="submit"
        >
          Decode
        </Button>
      </form>

      <TableContainer sx={{ maxWidth: 900 }} component={Paper}>
        <Table size="medium">
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="right" className="!font-bold md:whitespace-nowrap !pl-8 max-md:w-[1px]">
                  <span>{row.name}</span>
                </TableCell>
                <TableCell>
                  <span>{row.value}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
