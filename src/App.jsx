import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { stringify } from "querystring";
import { Card, Grid } from "@mui/material";

import Filters from "./components/Filters";
import Search from "./components/Search";
import Results from "./components/Results";

function App() {
  useEffect(() => {
    getAccessToken();
  }, []);

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef();

  const [server, setServer] = useState("");
  const [region, setRegion] = useState("");
  const [zone, setZone] = useState("");
  const [characters, setCharacters] = useState("");
  const [characterData, setCharacterData] = useState(null);

  const submitForm = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event("submit", { cancelable: true }));
    }
  };

  async function getAccessToken() {
    const auth = {
      username: import.meta.env.VITE_CLIENT_ID,
      password: import.meta.env.VITE_CLIENT_SECRET,
    };

    const data = stringify({
      grant_type: "client_credentials",
    });

    const config = {
      method: "post",
      url: "https://sod.warcraftlogs.com/oauth/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: auth,
      data: data,
    };

    try {
      const response = await axios(config);
      setToken(response.data.access_token);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <h1>Warcraft Group Logs</h1>
      <Grid container spacing={2}>
        <Grid item md={4}>
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "1em",
               
              }}
            >
              <Filters
                server={server}
                setServer={setServer}
                region={region}
                setRegion={setRegion}
                zone={zone}
                setZone={setZone}
              />
              <Search
                token={token}
                setLoading={setLoading}
                characters={characters}
                setCharacters={setCharacters}
                server={server}
                region={region}
                zone={zone}
                setCharacterData={setCharacterData}
                submitForm={submitForm}
              />
            </Card>
          </form>
        </Grid>
        <Grid item md={8}>
          {loading && "Loading..."}
          <Results characterData={characterData} />
        </Grid>
      </Grid>
    </>
  );
}

export default App;
