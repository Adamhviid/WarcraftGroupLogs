import { useState, useEffect, useRef } from "react";
import { Card, Grid, Typography, Link } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import Filters from "./components/Filters";
import Search from "./components/Search";
import Result from "./components/ResultCard/Result";

function App() {
    const [loading, setLoading] = useState(false);
    const formRef = useRef();

    const [server, setServer] = useState("");
    const [region, setRegion] = useState("");
    const [zone, setZone] = useState("");
    const [characters, setCharacters] = useState("");
    const [characterData, setCharacterData] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setServer(queryParams.get("server") || "");
        setRegion(queryParams.get("region") || "");
        setZone(queryParams.get("zone") || "");
        setCharacters(queryParams.get("characters") || "");
    }, []);

    useEffect(() => {
        const params = new URLSearchParams({
            server,
            region,
            zone,
            characters,
        });
        navigate(`?${params}`);
    }, [server, region, zone, characters, navigate]);

    const submitForm = (event) => {
        event.preventDefault();
        if (formRef.current) {
            formRef.current.dispatchEvent(new Event("submit", { cancelable: true }));
        }
    };

    return (
        <>
            <div>
                <Typography
                    variant="h2"
                    component="div"
                    gutterBottom>
                    Warcraft Group Logs
                </Typography>
                <Typography
                    variant="p"
                    component="div"
                    gutterBottom>
                    This Website is built to be used with{" "}
                    <Link
                        href="https://curseforge.com/wow/addons/warcraftgrouplogs"
                        target="_blank"
                        rel="noopener noreferrer">
                        {" "}
                        my addon, WarcraftGroupLogs.
                    </Link>{" "}
                    <p>
                        The addon automatically generates a link for this site with region, server, current raid and an array with all party and raid
                        members.
                    </p>
                    <p>
                        Click on any of the players names, to go directly to their WarcraftLogs profile, to see an indepth analysis of their
                        performance
                    </p>
                </Typography>
                <br />
            </div>
            <Grid
                container
                spacing={2}
                alignItems="center">
                <Grid
                    item
                    md={12}>
                    {loading && "Loading..."}
                    <Result
                        characterData={characterData}
                        server={server}
                        region={region}
                        zone={zone}
                    />
                </Grid>
                <Grid
                    item
                    md={12}>
                    <form
                        ref={formRef}
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}>
                        <Card
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "1em",
                                /* background: "#3f3f3f", */
                            }}>
                            <Filters
                                server={server}
                                setServer={setServer}
                                region={region}
                                setRegion={setRegion}
                                zone={zone}
                                setZone={setZone}
                            />
                            <Search
                                setLoading={setLoading}
                                characters={characters}
                                setCharacters={setCharacters}
                                server={server}
                                region={region}
                                zone={zone}
                                setCharacterData={setCharacterData}
                                submitForm={(event) => submitForm(event)}
                            />
                        </Card>
                    </form>
                </Grid>
            </Grid>
        </>
    );
}

export default App;
