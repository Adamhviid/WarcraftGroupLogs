import { useState, useEffect, useRef } from "react";
import { Card, Grid, Typography, Link } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import Filters from "./components/Filters";
import Search from "./components/Search";
import Result from "./components/ResultCard/Result";
import Loading from "./components/Loading";

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
      <Grid
        container
        /* spacing={2} */
        alignItems="center"
        sx={{ width: "100%", paddingTop: "10px" }}
      >
        <Grid item md={12}>
          <Typography variant="h2" component="div" gutterBottom>
            Warcraft Group Logs
          </Typography>
          <Typography variant="p" component="div" gutterBottom>
            This website is designed to work seamlessly with my addon,{" "}
            <Link
              href="https://curseforge.com/wow/addons/warcraftgrouplogs"
              target="_blank"
              rel="noopener noreferrer"
            >
              WarcraftGroupLogs
            </Link>
            .
            <p>
              The addon effortlessly generates a personalized link for this
              site, automatically fetching your region, server, current raid or
              group
            </p>
            <p>
              Simply click on any player's name to dive straight into their
              WarcraftLogs profile and get an in-depth analysis of their
              performance.
            </p>
          </Typography>
          <br />
        </Grid>

        <Grid item md={12}>
          {/* {loading && "Loading..."} */}
          <Loading loading={loading} />
          <Result
            characterData={characterData}
            version={version}
            server={server}
            region={region}
            zone={zone}
            difficulty={difficulty}
          />
        </Grid>
        <Grid item md={12}>
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "1em",
              }}
            >
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1em",
                  width: {
                    xs: "100%",
                    sm: "90%",
                    md: "80%",
                    lg: "70%",
                    xl: "60%",
                  },
                  maxWidth: "1080px",
                }}
              >
                <Filters
                  version={version}
                  setVersion={setVersion}
                  server={server}
                  setServer={setServer}
                  region={region}
                  setRegion={setRegion}
                  zone={zone}
                  setZone={setZone}
                  difficulty={difficulty.toString()}
                  setDifficulty={setDifficulty}
                  updateQueryParams={updateQueryParams}
                  characters={characters}
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
        <div
          style={{
            bottom: 0,
            left: 0,
            right: 0,
            width: "100%",
            textAlign: "center",
          }}
        >
          <a
            href="https://www.buymeacoffee.com/adamhviid"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://cdn.buymeacoffee.com/buttons/v2/arial-white.png"
              alt="Buy Me A Coffee"
              style={{
                height: "auto",
                width: "150px",
                marginTop: "50px",
                marginBottom: "-15px",
              }}
            />
          </a>
          <p>For less than what a store mount cost ;)</p>
          <p>
            Let me know if you have any feedback on reddit, github or curseforge
          </p>
        </div>
      </Grid>
    </>
  );
}

export default App;
