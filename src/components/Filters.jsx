import { useState, useEffect } from "react";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Grid,
  Autocomplete,
  TextField,
} from "@mui/material";

import retail_eu_servers from "../data/servers/retail_eu.json";
import retail_us_servers from "../data/servers/retail_us.json";
import retail_zones from "../data/zones/retail.json";

import vanilla_eu_servers from "../data/servers/vanilla_eu.json";
import vanilla_us_servers from "../data/servers/vanilla_us.json";
import vanilla_zones from "../data/zones/vanilla.json";

import fresh_eu_servers from "../data/servers/fresh_eu.json";
import fresh_us_servers from "../data/servers/fresh_us.json";
import fresh_zones from "../data/zones/fresh.json";

import sod_eu_servers from "../data/servers/sod_eu.json";
import sod_us_servers from "../data/servers/sod_us.json";
import sod_zones from "../data/zones/sod.json";

import classic_zones from "../data/zones/classic.json";
import classic_eu_servers from "../data/servers/classic_eu.json";

function Filters({
  version,
  setVersion,
  server,
  setServer,
  region,
  setRegion,
  zone,
  setZone,
  difficulty,
  setDifficulty,
  updateQueryParams,
  characters,
}) {
  const [servers, setServers] = useState([]);
  const [expansionsData, setExpansionsData] = useState([]);
  const [selectedExpansion, setSelectedExpansion] = useState("");
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);

  useEffect(() => {
    let newExpansionsData = [];
    let newServers = [];

    switch (version) {
      case "retail":
        newExpansionsData = retail_zones;
        newServers = region === "EU" ? retail_eu_servers : retail_us_servers;
        break;

      case "vanilla":
        newExpansionsData = vanilla_zones;
        newServers = region === "EU" ? vanilla_eu_servers : vanilla_us_servers;
        break;

      case "fresh":
        newExpansionsData = fresh_zones;
        newServers = region === "EU" ? fresh_eu_servers : fresh_us_servers;
        break;

      case "sod":
        newExpansionsData = sod_zones;
        newServers = region === "EU" ? sod_eu_servers : sod_us_servers;
        break;

      /* MANGLER STADIG US SERVERE */
      case "classic":
        newExpansionsData = classic_zones;
        newServers = region === "EU" ? classic_eu_servers : classic_eu_servers;
        break;

      default:
        newExpansionsData = [];
        newServers = [];
        break;
    }

    setExpansionsData(newExpansionsData);
    setServers(newServers);

    if (newExpansionsData.length > 0) {
      const firstExpansionName = Object.keys(newExpansionsData[0])[0];
      setSelectedExpansion(firstExpansionName);
    } else {
      setSelectedExpansion("");
    }
  }, [region, version]);

  useEffect(() => {
    if (selectedExpansion && expansionsData.length > 0) {
      const expansionObj = expansionsData.find(
        (exp) => Object.keys(exp)[0] === selectedExpansion,
      );

      if (expansionObj) {
        const newZones = expansionObj[selectedExpansion];
        setZones(newZones);

        const foundZone = newZones.find((z) => z.id == zone);
        if (foundZone) {
          setSelectedZone(foundZone);
        } else {
          if (zone !== "") {
            setZone("");
          }
          setSelectedZone(null);
        }
      }
    } else {
      setZones([]);
      setSelectedZone(null);
    }
  }, [selectedExpansion, expansionsData, zone]);

  useEffect(() => {
    if (selectedZone && selectedZone.hasDifficulties) {
      const items = renderDifficultyMenuItems();
      const lowestDifficulty = items.reduce(
        (minItem, currentItem) =>
          parseInt(currentItem.props.value) < parseInt(minItem.props.value)
            ? currentItem
            : minItem,
        items[0],
      );

      if (difficulty == "") {
        setDifficulty(lowestDifficulty);
      } else {
        setDifficulty(difficulty);
      }

      updateQueryParams({
        version,
        server,
        region,
        zone,
        difficulty: difficulty,
        characters,
      });
    }
  }, [zone, selectedZone]);

  const handleVersionChange = (event) => {
    setVersion(event.target.value);

    setServer("");
    setZone("");
    setDifficulty("");
    setSelectedZone(null);
    setSelectedExpansion("");
    updateQueryParams({
      version: event.target.value,
      server: "",
      zone: "",
      difficulty: "",
    });
  };

  const handleServerChange = (newValue) => {
    const formattedValue = newValue ? newValue.replace(/\s+/g, "-") : "";
    setServer(formattedValue);
  };

  const handleRegionChange = (event) => {
    setRegion(event.target.value);
  };

  const handleExpansionChange = (event) => {
    const newExpansion = event.target.value;
    setSelectedExpansion(newExpansion);
    setZone("");
    setDifficulty("");
    setSelectedZone(null);
    updateQueryParams({
      zone: "",
      difficulty: "",
    });
  };

  const handleZoneChange = (event) => {
    const newZoneId = event.target.value;
    if (newZoneId === zone) return;

    const selectedZone = zones.find((z) => z.id === newZoneId);

    if (selectedZone) {
      setZone(newZoneId);
      setSelectedZone(selectedZone);

      if (!selectedZone.hasDifficulties) {
        const defaultDifficulty = "0";
        setDifficulty(defaultDifficulty);
        updateQueryParams({
          zone: newZoneId,
          difficulty: defaultDifficulty,
        });
      } else {
        setDifficulty("");
        updateQueryParams({
          zone: newZoneId,
        });
      }
    } else {
      setZone("");
      setSelectedZone(null);
      setDifficulty("");
      updateQueryParams({
        zone: "",
        difficulty: "",
      });
    }
  };

  const handleDifficultyChange = (event) => {
    const newDifficulty = String(event.target.value);
    const validDifficulties = renderDifficultyMenuItems().map(
      (item) => item.props.value,
    );
    if (!validDifficulties.includes(newDifficulty)) return;

    setDifficulty(newDifficulty);
    updateQueryParams({
      difficulty: newDifficulty,
    });
  };

  const renderDifficultyMenuItems = () => {
    const difficultyLevels = {
      //Molten core Specific heat levels
      2012: [
        { key: "normal", value: "3", label: "Heat level 1" },
        { key: "heroic", value: "4", label: "Heat level 2" },
        { key: "mythic", value: "5", label: "Heat level 3" },
      ],
      //cataclysm
      classic: [
        { key: "normal", value: "3", label: "Normal" },
        { key: "heroic", value: "4", label: "Heroic" },
      ],
      retail: [
        { key: "lfr", value: "1", label: "LFR" },
        { key: "normal", value: "3", label: "Normal" },
        { key: "heroic", value: "4", label: "Heroic" },
        { key: "mythic", value: "5", label: "Mythic" },
      ],
    };

    const items =
      difficultyLevels[zone] ||
      difficultyLevels[version] ||
      difficultyLevels.retail;

    return items.map((item) => (
      <MenuItem key={item.key} value={item.value}>
        {item.label}
      </MenuItem>
    ));
  };

  const getExpansionNames = () => {
    return expansionsData.map((exp) => Object.keys(exp)[0]);
  };

  return (
    <>
      <Grid container spacing={2}>
        {/* VERSION */}
        <Grid
          item
          xs={12}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormControl margin="normal" component="fieldset">
            <FormLabel component="legend">Version</FormLabel>
            <RadioGroup
              aria-label="version"
              row
              value={version}
              onChange={handleVersionChange}
            >
              <FormControlLabel
                value={"fresh"}
                control={<Radio />}
                label={"Classic Fresh Anniversary"}
              />
              <FormControlLabel
                value={"sod"}
                control={<Radio />}
                label={"Season of Discovery"}
              />
              <FormControlLabel
                value={"vanilla"}
                control={<Radio />}
                label={"Vanilla Era"}
              />
              <FormControlLabel
                value={"classic"}
                control={<Radio />}
                label={"Mist of Pandaria"}
              />
              <FormControlLabel
                value={"retail"}
                control={<Radio />}
                label={"Retail"}
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* REGION */}
        <Grid item xs={12} md={12} lg={3}>
          <FormControl
            disabled={version === ""}
            margin="normal"
            component="fieldset"
          >
            <FormLabel component="legend">Region</FormLabel>
            <RadioGroup
              aria-label="region"
              value={region}
              onChange={handleRegionChange}
              row
            >
              <FormControlLabel value="US" control={<Radio />} label="US" />
              <FormControlLabel value="EU" control={<Radio />} label="EU" />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* SERVER */}
        <Grid item xs={12} md={6} lg={4}>
          <FormControl margin="normal" fullWidth>
            <Autocomplete
              disabled={version === "" || region === ""}
              value={server || null}
              onChange={(event, newValue) => {
                handleServerChange(newValue);
              }}
              options={servers}
              getOptionLabel={(option) => option}
              isOptionEqualToValue={(option, value) =>
                option === value || option.replace(/\s+/g, "-") === value
              }
              renderInput={(params) => (
                <TextField {...params} label="Server" variant="outlined" />
              )}
            />
          </FormControl>
        </Grid>

        {/* EXPANSION */}
        <Grid item xs={12} md={6} lg={4}>
          <FormControl margin="normal" fullWidth>
            <InputLabel>Expansion</InputLabel>
            <Select
              disabled={version === ""}
              value={selectedExpansion}
              label="Expansion"
              onChange={handleExpansionChange}
            >
              {getExpansionNames().map((expansionName) => (
                <MenuItem key={expansionName} value={expansionName}>
                  {expansionName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* ZONE */}
        <Grid
          item
          xs={selectedZone && selectedZone.hasDifficulties ? 7 : 12}
          md={selectedZone && selectedZone.hasDifficulties ? 10 : 12}
        >
          <FormControl margin="normal" fullWidth>
            <InputLabel>Zone</InputLabel>
            <Select
              disabled={version === "" || !selectedExpansion}
              value={zones.find((z) => z.id == zone) ? zone : ""}
              label="Zones"
              onChange={handleZoneChange}
            >
              {zones.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* DIFFICULTY */}
        {selectedZone && selectedZone.hasDifficulties ? (
          <Grid item xs={5} md={2}>
            <FormControl margin="normal" fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                disabled={version === ""}
                value={
                  renderDifficultyMenuItems().find(
                    (item) => item.props.value === difficulty,
                  )
                    ? difficulty
                    : ""
                }
                label="difficulty"
                onChange={handleDifficultyChange}
              >
                {renderDifficultyMenuItems()}
              </Select>
            </FormControl>
          </Grid>
        ) : null}
      </Grid>
    </>
  );
}

export default Filters;
