import { useState, useEffect } from "react";
import axios from "axios";
import { stringify } from "querystring";
import "./App.css";

import {
  Box,
  Button,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";

function App() {
  const [token, setToken] = useState(null);
  const [characterData, setCharacterData] = useState(null);

  const [characterName, setCharacterName] = useState("");
  const handleCharacterNameChange = (event) => {
    setCharacterName(event.target.value);
  };

  const [server, setServer] = useState("");
  const handleServerChange = (event) => {
    setServer(event.target.value);
  };

  const [region, setRegion] = useState("");
  const handleRegionChange = (event) => {
    setRegion(event.target.value);
  };

  useEffect(() => {
    getAccessToken();
    console.log(token);
  }, []);

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

  async function getCharacterData() {
    const result = await axios({
      url: "https://sod.warcraftlogs.com/api/v2/client",
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        query: `query {
                characterData {
                    character(name: "${characterName}", serverSlug: "${server}", serverRegion: "${region}") {
                        zoneRankings(zoneID: 2008)
                    }
                }
            }`,
      },
    });

    setCharacterData(result.data);
  }

  return (
    <>
      <h1>Warcraft Group Logs</h1>
      <div>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <FormControl fullWidth>
            <InputLabel>Server</InputLabel>
            <Select value={server} label="Age" onChange={handleServerChange}>
              <MenuItem value={"Wild-Growth"}>Wild Growth</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Region</InputLabel>
            <Select value={region} label="Age" onChange={handleRegionChange}>
              <MenuItem value={"EU"}>EU</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <FormControl fullWidth>
          <TextField
            label="Character Name"
            value={characterName}
            variant="outlined"
            onChange={handleCharacterNameChange}
          />
        </FormControl>
        <Button
          variant="contained"
          onClick={getCharacterData}
          disabled={!characterName || !server || !region}
        >
          Search
        </Button>
        <p>{characterData && JSON.stringify(characterData, null, 2)}</p>
      </div>
    </>
  );
}

export default App;
