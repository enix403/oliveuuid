import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  Alert,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
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
  const [wellknownUuid, setWellknownUuid] = useState<string>("");

  const [uuid, setUuid] = useState<wasmCore.PartedUuid | null>(null);
  const [uuidStr, setUuidStr] = useState<string>("");

  const handleGenerate = useCallback(() => {
    let uuid = wasmCore.create_uuid();
    setUuidStr(wasmCore.format_uuid(uuid));
    setUuid(uuid);
  }, []);

  useEffect(() => {
    let ll = wasmCore.wellknown_list();
    setWellknowns(ll);
    if (ll.length > 0)
      setWellknownUuid(ll[0].name)
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
      <Box sx={{ width: 250, marginBottom: 2 }}>
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
      </Box>

      {hashBased && (
        <>
          <Typography
            variant="body1"
            className="!font-bold"
            sx={{ marginBottom: 2 }}
          >
            Namespace
          </Typography>

          <Box className="flex items-start gap-4" sx={{ mb: 0.5 }}>
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
            <Box sx={{ width: 450 }}>
              {nsType === "custom" ? (
                <TextField
                  label="Namespace"
                  variant="outlined"
                  // helperText="The namespace UUID. Enter your custom UUID, or choose a wellknown UUID"
                  InputProps={{ className: "!font-['Fira_Code'] !font-medium" }}
                  fullWidth
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
            </Box>
          </Box>

          <Box sx={{ marginBottom: 2 }}>
          <Typography variant="caption">
            The namespace UUID. Enter your custom UUID, or choose a wellknown
            UUID
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

      {uuid && (
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
            <div className="col-[1/-1] row-[1/2] flex items-center justify-center">
              <Typography variant="h4" fontFamily="Fira Code" fontWeight={700}>
                {/*ffb82219-2be8-4961-8c83-2163e1b4b966*/}
                {uuidStr}
              </Typography>
            </div>
            <div className="col-[2/3] row-[1/2] flex items-center justify-center">
              <Tooltip title="Copy to Clipboard">
                <IconButton>
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
