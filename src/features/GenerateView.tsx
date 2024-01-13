import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";

export function GenerateView() {
  const [version, setVersion] = useState<string>("");

  const handleVersionChange = (event: SelectChangeEvent) => {
    setVersion(event.target.value);
  };

  let versionInt = +version;
  let isVersionValid =
    versionInt === 1 ||
    versionInt === 3 ||
    versionInt === 4 ||
    versionInt === 5;

  return (
    <>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
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
            onChange={handleVersionChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
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

      {isVersionValid && (
        <Button color="primary" variant="contained" sx={{ marginBottom: 2 }}>
          Generate
        </Button>
      )}

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
        className="flex items-center justify-center"
      >
        <Typography variant="h4" fontFamily="Fira Code" fontWeight={700}>
          ffb82219-2be8-4961-8c83-2163e1b4b966
        </Typography>
      </Box>
    </>
  );
}
