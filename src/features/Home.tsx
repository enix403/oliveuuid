import { wasmCore } from "@/tunnel";
import { AddShoppingCart, Alarm, Delete, Send } from "@mui/icons-material";
import { Button, IconButton, Slider } from "@mui/material";
import { useEffect } from "react";

export function Home() {
  useEffect(() => {
    // console.log("Why hehhe");
    let uuid = wasmCore.create_uuid();
    let details = wasmCore.get_details(uuid);

    console.log(details.clock_seq);
  }, []);
  return (
    <>
      <div className="flex flex-col items-start gap-y-6 p-8">
        <h1>Hello</h1>
        <Button color="primary" variant="contained">
          Hello
        </Button>
        <Button color="secondary" variant="contained">
          Hello
        </Button>
        <Button color="success" variant="contained">
          Hello
        </Button>
        <Button color="error" variant="contained">
          Hello
        </Button>
        <Button color="warning" variant="contained">
          Hello
        </Button>
        <Button variant="outlined" startIcon={<Delete />}>
          Delete
        </Button>
        <Button variant="contained" endIcon={<Send />}>
          Send
        </Button>
        <div className="flex gap-x-6">
          <IconButton color="error" aria-label="delete">
            <Delete />
          </IconButton>
          <IconButton aria-label="delete" disabled color="primary">
            <Delete />
          </IconButton>
          <IconButton color="secondary" aria-label="add an alarm">
            <Alarm />
          </IconButton>
          <IconButton color="primary" aria-label="add to shopping cart">
            <AddShoppingCart />
          </IconButton>
        </div>
        <Slider
          defaultValue={30}
          sx={{
            width: 300,
            color: "error.main",
          }}
        />
      </div>
    </>
  );
}
