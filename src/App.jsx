import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { stringify } from "querystring";
import { Box } from "@mui/material";

import Filters from "./components/Filters";
import Search from "./components/Search";

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
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
        </Box>
      </form>

      <div>
        {loading && <p>Loading...</p>}
        {characterData && (
          <div>
            {characterData.map((data, index) => (
              <p key={index}>
                {data.name}:{" "}
                {data.result
                  ? `${data.result.zoneRankings.bestPerformanceAverage.toFixed(
                      1
                    )}, ${data.result.zoneRankings.metric}`
                  : "null"}
              </p>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
