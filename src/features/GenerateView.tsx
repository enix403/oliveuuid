import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from "@mui/icons-material/Done";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useState, useCallback, useEffect } from "react";

import { wasmCore } from "@/tunnel";

export function GenerateView() {
  const [version, setVersion] = useState<string>("1");
  const [nsType, setNsType] = useState<"custom" | "wellknown">("custom");

  const [wellknowns, setWellknowns] = useState<wasmCore.WellKnownUuid[]>([]);

  const [namespace, setNamespace] = useState<string>("");
  const [wellknownUuid, setWellknownUuid] = useState<string>("");

  const [name, setName] = useState<string>("");

  const [uuidStr, setUuidStr] = useState<string>("");

  const [copied, setCopied] = useState(false);
  const [invalidCustomNs, setInvalidCustomNs] = useState(false);

  const handleGenerate = async () => {
    let uuid: wasmCore.PartedUuid | null = null;
    setInvalidCustomNs(false);

    await new Promise((resolve) => setTimeout(() => resolve(void 0), 0));

    if (versionInt === 1) {
      uuid = wasmCore.create_uuid_v1() ?? null;
    } else if (versionInt === 4) {
      uuid = wasmCore.create_uuid_v4();
    } else {
      // Version 3 or 5
      let namespaceUuid: wasmCore.PartedUuid;

      if (nsType === "custom") {
        let parsed = wasmCore.parse_uuid(namespace);
        if (parsed === undefined) {
          // alert("Failed to parse namespace");
          setInvalidCustomNs(true);
          return;
        }

        namespaceUuid = parsed;
      } else {
        let selectedWellKnown = wellknowns.find(
          (wk) => wk.name === wellknownUuid
        );
        if (selectedWellKnown === undefined) {
          alert("Invalid namespace");
          return;
        }

        namespaceUuid = selectedWellKnown.uuid;
      }

      // console.log(wasmCore.format_uuid(namespaceUuid));

      if (versionInt === 3)
        //
        uuid = wasmCore.create_uuid_v3(name, namespaceUuid);
      else if (versionInt === 5)
        //
        uuid = wasmCore.create_uuid_v5(name, namespaceUuid);
    }

    if (uuid) {
      setUuidStr(wasmCore.format_uuid(uuid));
    }
  };

  useEffect(() => {
    let ll = wasmCore.wellknown_list();
    setWellknowns(ll);
    if (ll.length > 0) setWellknownUuid(ll[0].name);
  }, []);

  let versionInt = +version;
  let isVersionValid =
    versionInt === 1 ||
    versionInt === 3 ||
    versionInt === 4 ||
    versionInt === 5;

  let hashBased = isVersionValid && (versionInt === 3 || versionInt === 5);

  return (
    <>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Generate UUID
      </Typography>
      <div className="mb-4 md:max-w-[250px]">
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Version</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Version"
            value={version}
            onChange={(event) => setVersion(event.target.value)}
          >
            <MenuItem value={1}>
              V1
              <span className="ml-1 italic">(Node and Time Based)</span>
            </MenuItem>
            <MenuItem value={3}>
              V3
              <span className="ml-1 italic">(MD5 Hash Bashed)</span>
            </MenuItem>
            <MenuItem value={4}>
              V4 <span className="ml-1 italic">(Random)</span>
            </MenuItem>
            <MenuItem value={5}>
              V5 <span className="ml-1 italic">(SHA1 Hash Bashed)</span>
            </MenuItem>
          </Select>
        </FormControl>
      </div>

      {hashBased && (
        <>
          <Typography
            variant="body1"
            className="!font-bold"
            sx={{ marginBottom: 2 }}
          >
            Namespace
          </Typography>

          <div className="mb-0.5 flex flex-col gap-4 md:flex-row md:items-start">
            <FormControl className="shrink-0">
              <InputLabel>Input Type</InputLabel>
              <Select
                label="Input Type"
                value={nsType}
                onChange={(event) => setNsType(event.target.value as any)}
              >
                <MenuItem value="custom">Custom</MenuItem>
                <MenuItem value="wellknown">Well Known</MenuItem>
              </Select>
            </FormControl>
            <div className="w-full md:max-w-[450px]">
              {nsType === "custom" ? (
                <TextField
                  label="Namespace"
                  variant="outlined"
                  helperText={
                    invalidCustomNs ? "Failed to parse this UUID" : undefined
                  }
                  error={!!invalidCustomNs}
                  InputProps={{ className: "!font-['Fira_Code'] !font-medium" }}
                  fullWidth
                  value={namespace}
                  onChange={(event) => {
                    setNamespace(event.target.value);
                    setInvalidCustomNs(false);
                  }}
                />
              ) : (
                <Select
                  fullWidth
                  value={wellknownUuid}
                  onChange={(event) => setWellknownUuid(event.target.value)}
                >
                  {wellknowns.map((wk) => (
                    <MenuItem key={wk.name} value={wk.name}>
                      {wk.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </div>
          </div>

          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="caption">
              The namespace UUID. Enter your custom UUID, or choose a wellknown
              UUID
              {nsType === "custom" && (
                <>
                  <br />
                  The namespace must be a valid UUID in the format{" "}
                  <Typography
                    display="inline"
                    variant="inherit"
                    color="primary.main"
                  >
                    00000000-0000-0000-0000-000000000000
                  </Typography>
                </>
              )}
            </Typography>
          </Box>

          <Typography
            variant="body1"
            className="!font-bold"
            sx={{ marginBottom: 2 }}
          >
            Name
          </Typography>

          <div className="mb-0.5 md:max-w-[750px]">
            <TextField
              label="Enter Name"
              variant="outlined"
              InputProps={{ className: "!font-['Fira_Code'] !font-medium" }}
              fullWidth
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="caption">
              Required. Name can be anything
            </Typography>
          </Box>
        </>
      )}

      {isVersionValid && (
        <Button
          color="primary"
          variant="contained"
          sx={{ marginBottom: 2 }}
          onClick={handleGenerate}
        >
          Generate
        </Button>
      )}

      {uuidStr && (
        <Box
          sx={{
            width: "100%",
            bgcolor: "success.500",
            px: 2,
            py: 2,
            borderRadius: 1.4,
            border: 1,
            borderColor: "success.600",
          }}
        >
          <div className="grid grid-cols-[1fr_auto] grid-rows-1">
            <div className="col-[1/-1] row-[1/2] flex items-center justify-center pr-8 md:px-12">
              <span className="font-['Fira_Code'] text-lg font-bold sm:text-xl md:text-2xl lg:text-3xl">
                {uuidStr}
              </span>
            </div>
            <div className="col-[2/3] row-[1/2] flex items-center justify-center">
              <Tooltip
                onOpen={() => setCopied(false)}
                title={
                  !copied ? (
                    "Copy to Clipboard"
                  ) : (
                    <Typography variant="inherit" className="flex items-center gap-x-1">
                      <DoneIcon fontSize="small" color="success" />
                      Copied
                    </Typography>
                  )
                }
              >
                <IconButton
                  onClick={() => {
                    navigator.clipboard.writeText(uuidStr);
                    setCopied(true);
                  }}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </Box>
      )}
    </>
  );
}
