import { wasmCore } from "@/tunnel";
import {
  Button,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";

import { useEffect, useState } from "react";

function GenerateView() {
  const [version, setVersion] = useState<string>("1");

  const handleVersionChange = (event: SelectChangeEvent) => {
    setVersion(event.target.value);
  };

  return (
    <>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Generate UUID
      </Typography>
      <FormControl>
        <InputLabel>Version</InputLabel>
        <Select
          label="Version"
          value={version}
          onChange={handleVersionChange}
        >
          <MenuItem value={1}>V1 (Node and Time Based)</MenuItem>
          <MenuItem value={3}>V3 (MD5 Hashed Bashed)</MenuItem>
          <MenuItem value={4}>V4 (Random)</MenuItem>
          <MenuItem value={5}>V5 (SHA1 Hashed Bashed)</MenuItem>
        </Select>
      </FormControl>
    </>
  );
}

function DecodeView() {
  return (
    <>
      <Typography variant="h6">Decode UUID</Typography>
    </>
  );
}

export function Home() {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (_event, tab: number) => {
    setActiveTab(tab);
  };

  return (
    <>
      <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
        <Tabs value={activeTab} onChange={handleChange} centered>
          <Tab label="Generate" />
          <Tab label="Decode" />
        </Tabs>
      </Box>
      <Box sx={{ padding: 4 }}>
        {activeTab === 0 ? <GenerateView /> : <DecodeView />}
      </Box>
    </>
  );
}
