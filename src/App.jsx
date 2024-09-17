import { useState, useEffect, useRef } from "react";
import { Card, Grid, Typography, Link } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import Filters from "./components/Filters";
import Search from "./components/Search";
import Result from "./components/ResultCard/Result";

function App() {
  const [loading, setLoading] = useState(false);
  const formRef = useRef();

  const [version, setVersion] = useState("");
  const [server, setServer] = useState("");
  const [region, setRegion] = useState("");
  const [zone, setZone] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [characters, setCharacters] = useState("");
  const [characterData, setCharacterData] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setVersion(queryParams.get("version") || "");
    setServer(queryParams.get("server") || "");
    setRegion(queryParams.get("region") || "");
    setZone(queryParams.get("zone") || "");
    setDifficulty(queryParams.get("difficulty") || "");
    setCharacters(queryParams.get("characters") || "");
  }, []);

  useEffect(() => {
    const params = new URLSearchParams({
      version,
      server,
      region,
      zone,
      difficulty,
      characters,
    });
    navigate(`?${params}`);
  }, [version, server, region, zone, difficulty, characters, navigate]);

  const submitForm = (event) => {
    event.preventDefault();
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event("submit", { cancelable: true }));
    }
  };

  const updateQueryParams = (params) => {
    const queryParams = new URLSearchParams(params);
    navigate(`${location.pathname}?${queryParams}`);
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
          This Website is built to be used with my addon,{" "}
          <Link
            href="https://curseforge.com/wow/addons/warcraftgrouplogs"
            target="_blank"
            rel="noopener noreferrer">
            {" "}
            WarcraftGroupLogs
          </Link>{" "}
          <p>
            The addon automatically generates a link for this site with region, server, current raid and an array with all party and raid members.
          </p>
          <p>Click on any of the players names, to go directly to their WarcraftLogs profile, to see an indepth analysis of their performance</p>
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
            version={version}
            server={server}
            region={region}
            zone={zone}
            difficulty={difficulty}
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
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1em",
                  width: "1080px",
                }}>
                <Filters
                  version={version}
                  setVersion={setVersion}
                  server={server}
                  setServer={setServer}
                  region={region}
                  setRegion={setRegion}
                  zone={zone}
                  setZone={setZone}
                  difficulty={difficulty}
                  setDifficulty={setDifficulty}
                  updateQueryParams={updateQueryParams}
                />
                <Search
                  setLoading={setLoading}
                  characters={characters}
                  setCharacters={setCharacters}
                  version={version}
                  server={server}
                  region={region}
                  zone={zone}
                  difficulty={difficulty}
                  setDifficulty={setDifficulty}
                  setCharacterData={setCharacterData}
                  submitForm={(event) => submitForm(event)}
                />
              </Card>
            </div>
          </form>
        </Grid>
      </Grid>

      <a
        href="https://www.buymeacoffee.com/adamhviid"
        target="_blank">
        <img
          src="https://cdn.buymeacoffee.com/buttons/v2/arial-white.png"
          alt="Buy Me A Coffee"
          style={{ height: "auto", width: "150px", marginTop: "150px" }}
        />
      </a>
    </>
  );
}

export default App;
