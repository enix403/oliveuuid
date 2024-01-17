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
import { useState } from "react";

type DecodeRow = {
  name: string;
  value: string | number;
};

function getVersionString(version: number) {
  let verstrs = {
    1: "1 (time and node based)",
    3: "3 (name based, MD5)",
    4: "4 (random data based)",
    5: "5 (name based, SHA-1)",
  };

  return verstrs[version] || `${version} (Unknown)`;
}

function getVariantString(variantOctet: number) {
  let high = variantOctet >> 4;

  // 0 - 7 | 0xxx | reserved (NCS backward compatible)
  // 8 - b | 10xx | DCE 1.1, ISO/IEC 11578:1996
  // c - d | 110x | reserved (Microsoft GUID)
  // e - f | 111x | reserved (future use)

  if (high <= 7) return "0xxx - reserved (NCS backward compatible)";
  if (high <= 12) return "10xx - DCE 1.1, ISO/IEC 11578:1996";
  if (high <= 14) return "110x - reserved (Microsoft GUID)";
  else return "111x - reserved (future use)";
}

// const rows: DecodeRow[] = [
//   {
//     name: "Standard String Format",
//     value: "35aea681-b491-11ee-8c16-925659db43db",
//   },
//   {
//     name: "Single Integer Value",
//     value: "71355920586295452480991953809030464475",
//   },
//   { name: "Version", value: "1 (time and node based)" },
//   { name: "Variant", value: "DCE 1.1, ISO/IEC 11578:1996" },
//   { name: "Contents - Time", value: "2024-01-16 17:03:45.896000.1 UTC" },
//   { name: "Contents - Clock", value: "3094" },
//   { name: "Contents - Node", value: "92:56:59:db:43:db (local unicast)" },
// ];

function toBytes(number: bigint | number, numBytes: number): number[] {
  let bytes: number[] = [];

  let mask: number | bigint = 0xff;
  let shift: number | bigint = 8;
  if (typeof number === "bigint")
  {
    mask = BigInt(mask);
    shift = BigInt(shift);
  }


  for (let i = 0; i < numBytes; ++i) {
    // @ts-ignore
    let byte = Number(number & mask);
    // @ts-ignore
    number = number >> shift;
    bytes.push((byte));
  }

  return bytes.reverse();
}

function formatNode(number: bigint) {
  let bytes = toBytes(number, 6);

  let hexParts = bytes.map((byte) => byte.toString(16));
  let nodeStr = hexParts.join(":");

  let octet = bytes[0];

  let range = octet & 0x02 ? "local" : "global";
  let cast = octet & 0x01 ? "multicast" : "unicast";

  return `${nodeStr} (${range} ${cast})`;
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
      { name: "Contents - Clock", value: result.details.clock_seq },
      { name: "Contents - Node", value: formatNode(result.details.node) },
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

      <TableContainer sx={{ maxWidth: 800 }} component={Paper}>
        <Table size="medium">
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="right" className="!font-bold">
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
