import "./global.css";

// import "@fontsource/inter/300.css";
// import "@fontsource/inter/400.css";
// import "@fontsource/inter/500.css";
// import "@fontsource/inter/600.css";
// import "@fontsource/inter/700.css";
// import "@fontsource/inter/800.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import '@fontsource/fira-code/500.css'
import '@fontsource/fira-code/700.css'

import { Home } from "features/Home";

import { loadWasmCore } from "./tunnel";
import { useEffect, useState } from "react";

import { ScopedCssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme";

export const App = () => {
  let [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Load the WASM Core
    loadWasmCore().then(() => {
      setLoading(false);
    });
  }, []);

  return (
    <>
      {loading ? (
        "Loading..."
      ) : (
        <ThemeProvider theme={theme}>
          <ScopedCssBaseline className="min-h-screen">
            <Home />
          </ScopedCssBaseline>
        </ThemeProvider>
      )}
    </>
  );
  // return <Home />;
};
