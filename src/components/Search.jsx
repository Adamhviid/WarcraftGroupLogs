import { useEffect, useState } from "react";
import axios from "axios";
import { Button, TextField, FormControl } from "@mui/material";
import PropTypes from "prop-types";

function Search({ setLoading, characters, setCharacters, version, server, region, zone, difficulty, setCharacterData }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    setCharacterData([]);
  }, []);

  const handleCharactersChange = (event) => {
    setCharacters(event.target.value);
  };

  async function getCharacterData(event) {
    event.preventDefault();

    setLoading(true);
    setCharacterData(null);
    const charsArray = characters
      .split(",")
      .map((name) => name.trim().toLowerCase())
      .filter((name) => name !== "");

    if (charsArray.length > 25) {
      setError("Character list cannot exceed 25 characters.");
      return;
    }

    setError(null);

    const promises = charsArray.map(async (name) => {
      let characterName = name;
      let characterServer = server;

      //in retail characters from different server have a "name-server" like name, therefore split only if names contain "-"
      if (version === "retail" && name.includes("-")) {
        [characterName, characterServer] = name.split("-");
      }

      const requestData = {
        name: characterName,
        version,
        server: characterServer,
        region,
        zone,
        difficulty,
      };

      const result = await axios({
        url: `${import.meta.env.VITE_BACKEND_URL}/api/get_character_data`,
        method: "POST",
        data: requestData,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return result.data;
    });
    const results = await Promise.all(promises);
    setCharacterData(results);
    setLoading(false);
  }

  return (
    <>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <FormControl
        margin="normal"
        fullWidth>
        <TextField
          label="Characters"
          value={characters}
          variant="outlined"
          onChange={handleCharactersChange}
          inputProps={{
            style: {
              textAlign: "center",
            },
          }}
        />
      </FormControl>
      <Button
        variant="contained"
        onClick={(event) => getCharacterData(event)}
        disabled={!characters || !version || !server || !region || !zone}
        type="submit">
        Search
      </Button>
    </>
  );
}

Search.propTypes = {
  setLoading: PropTypes.func.isRequired,
  characters: PropTypes.string.isRequired,
  setCharacters: PropTypes.func.isRequired,
  version: PropTypes.string.isRequired,
  server: PropTypes.string.isRequired,
  region: PropTypes.string.isRequired,
  zone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  difficulty: PropTypes.string.isRequired,
  setCharacterData: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
};

export default Search;
