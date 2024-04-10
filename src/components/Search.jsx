import axios from "axios";
import { Button, TextField, FormControl } from "@mui/material";
import PropTypes from "prop-types";

import exampleRaid from "../data/exampleRaid.json";

function Search({ token, setLoading, characters, setCharacters, server, region, zone, setCharacterData, submitForm }) {
    const handleCharactersChange = (event) => {
        setCharacters(event.target.value);
    };

    async function getCharacterData() {
        setLoading(true);
        setCharacterData(null);
        const charsArray = characters.split(",").map((name) => name.trim());

        const promises = charsArray.map(async (name) => {
            const result = await axios({
                url: "https://sod.warcraftlogs.com/api/v2/client",
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    query: `query {
                              characterData {
                                character(name: "${name}", serverSlug: "${server}", serverRegion: "${region}") {
                                  classID
                                  healerRankings: zoneRankings(zoneID: ${zone}, role: Healer, metric: hps)
                                  tankRankings: zoneRankings(zoneID: ${zone}, role: Tank, metric: dps)
                                  dpsRankings: zoneRankings(zoneID: ${zone}, role: DPS, metric: dps)
                                }
                              }
                            }`,
                },
            });

            return {
                name,
                result: result.data.data.characterData.character
                    ? result.data.data.characterData.character
                    : {
                          classID: 1,
                          healerRankings: {
                              bestPerformanceAverage: null,
                              medianPerformanceAverage: null,
                              rankings: [],
                          },
                          tankRankings: {
                              bestPerformanceAverage: null,
                              medianPerformanceAverage: null,
                              rankings: [],
                          },
                          dpsRankings: {
                              bestPerformanceAverage: null,
                              medianPerformanceAverage: null,
                              rankings: [],
                          },
                      },
            };
        });
        const results = await Promise.all(promises);

        setCharacterData(results);
        setLoading(false);
        submitForm();
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
                    inputProps={{ style: { textAlign: "center" } }}
                />
            </FormControl>

            <Button
                variant="contained"
                type="submit"
                onClick={getCharacterData}
                disabled={!characters || !server || !region || !zone}>
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
    token: PropTypes.string,
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
