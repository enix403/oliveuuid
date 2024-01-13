import {
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";

import { useEffect, useState } from "react";
import { GenerateView } from "./GenerateView";

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
