import { useEffect } from "react";
import axios from "axios";
import { Button, TextField, FormControl } from "@mui/material";
import PropTypes from "prop-types";

/* import exampleRaid from "../data/exampleRaid.json"; */

function Search({ setLoading, characters, setCharacters, server, region, zone, setCharacterData }) {
    useEffect(() => {
        setCharacterData([]);
    }, [server, region, zone]);

    const handleCharactersChange = (event) => {
        setCharacters(event.target.value);
    };

    async function getCharacterData(event) {
        event.preventDefault();

        setLoading(true);
        setCharacterData(null);
        const charsArray = characters.split(",").map((name) => name.trim());

        const promises = charsArray.map(async (name) => {
            const result = await axios({
                url: `${import.meta.env.VITE_BACKEND_URL}/sod/get_character_data`,
                method: "POST",
                data: {
                    name,
                    server,
                    region,
                    zone,
                },
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
                disabled={!characters || !server || !region || !zone}
                type="submit">
                Search
            </Button>

            {/* <Button
                variant="contained"
                type="button"
                onClick={() => setCharacterData(exampleRaid)}>
                Use Example Raid
            </Button> */}
        </>
    );
}

Search.propTypes = {
    setLoading: PropTypes.func.isRequired,
    characters: PropTypes.string.isRequired,
    setCharacters: PropTypes.func.isRequired,
    server: PropTypes.string.isRequired,
    region: PropTypes.string.isRequired,
    zone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    setCharacterData: PropTypes.func.isRequired,
    submitForm: PropTypes.func.isRequired,
};

export default Search;
