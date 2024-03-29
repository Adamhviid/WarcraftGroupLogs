import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Card, Grid, Typography, Link } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import Filters from "./components/Filters";
import Search from "./components/Search";
import Result from "./components/ResultCard/Result";

function App() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        getAccessToken();
        const queryParams = new URLSearchParams(location.search);
        setServer(queryParams.get("server") || "");
        setRegion(queryParams.get("region") || "");
        setZone(queryParams.get("zone") || "");
        setCharacters(queryParams.get("characters") || "");
    }, []);

    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const formRef = useRef();

    const [server, setServer] = useState("");
    const [region, setRegion] = useState("");
    const [zone, setZone] = useState("");
    const [characters, setCharacters] = useState("");
    const [characterData, setCharacterData] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams({
            server,
            region,
            zone,
            characters,
        });
        navigate(`?${params}`);
    }, [server, region, zone, characters, navigate]);

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

        const params = new URLSearchParams({
            grant_type: "client_credentials",
        });

        const config = {
            method: "post",
            url: "https://sod.warcraftlogs.com/oauth/token",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            auth: auth,
            data: params,
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
                    <p>
                        This Website is built to be used with{" "}
                        <Link
                            href="https://curseforge.com/wow/addons/warcraftgrouplogs"
                            target="_blank"
                            rel="noopener noreferrer">
                            {" "}
                            my addon, WarcraftGroupLogs.
                        </Link>{" "}
                        <p>The addon automatically generates a link for this site with region, server, current raid and an array with all party and raid members.</p>
                    </p>
                    <p>Click on any of the players, to go directly to their WarcraftLogs profile, to see an indepth analysis of their performance</p>
                </Typography>
                <br />
                <br />
                <br />
                <br />
            </div>
            <Grid
                container
                spacing={2}
                alignItems="center">
                <Grid
                    item
                    md={4}>
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
                <Grid
                    item
                    md={8}>
                    {loading && "Loading..."}
                    <Result
                        characterData={characterData}
                        server={server}
                        region={region}
                        zone={zone}
                    />
                </Grid>
            </Grid>
            <Typography
                variant="body2"
                align="center"
                style={{ marginTop: "100px" }}>
                This application is not affiliated with WarcraftLogs.
            </Typography>
        </>
    );
}

export default App;
