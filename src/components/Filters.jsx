import { useState, useEffect } from "react";
import PropTypes from "prop-types";
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

import sod_servers from "../data/servers/sod.json";
import retail_eu_servers from "../data/servers/retail_eu.json";
import retail_us_servers from "../data/servers/retail_us.json";
import classic_eu_servers from "../data/servers/classic_eu.json";
import classic_us_servers from "../data/servers/classic_us.json";

import sod_zones from "../data/zones/sod.json";
import retail_zones from "../data/zones/retail.json";
import classic_zones from "../data/zones/classic.json";

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
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);

  useEffect(() => {
    let newZones = [];
    let newServers = [];

    switch (version) {
      case "sod":
        newZones = sod_zones;
        newServers = sod_servers;
        break;

      case "classic":
        newZones = classic_zones;
        newServers = region === "EU" ? classic_eu_servers : classic_us_servers;
        break;

      case "retail":
        newZones = retail_zones;
        newServers = region === "EU" ? retail_eu_servers : retail_us_servers;
        break;

      default:
        newZones = [];
        newServers = [];
        break;
    }

    setZones(newZones);
    setServers(newServers);
    const foundZone = newZones.find((z) => z.id == zone);

    if (foundZone) {
      setSelectedZone(foundZone);
    } else {
      if (zone !== "") {
        setZone("");
      }
      setSelectedZone(null);
    }
  }, [region, version, zone]);

  useEffect(() => {
    if (selectedZone && selectedZone.hasDifficulties) {
      const items = renderDifficultyMenuItems();
      const lowestDifficulty = items.reduce(
        (minItem, currentItem) => (parseInt(currentItem.props.value) < parseInt(minItem.props.value) ? currentItem : minItem),
        items[0]
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
    const validDifficulties = renderDifficultyMenuItems().map((item) => item.props.value);
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

    const items = difficultyLevels[zone] || difficultyLevels[version] || difficultyLevels.retail;

    return items.map((item) => (
      <MenuItem
        key={item.key}
        value={item.value}>
        {item.label}
      </MenuItem>
    ));
  };

  return (
    <>
      <Grid
        container
        spacing={2}>
        {/* 
        VERSION
         */}
        <Grid
          item
          xs={12}
          style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <FormControl
            margin="normal"
            component="fieldset">
            <FormLabel component="legend">Version</FormLabel>
            <RadioGroup
              aria-label="version"
              row
              value={version}
              onChange={handleVersionChange}>
              <FormControlLabel
                value={"sod"}
                control={<Radio />}
                label={"Season of Discovery"}
              />
              <FormControlLabel
                value={"classic"}
                control={<Radio />}
                label={"Classic Cataclysm"}
              />
              <FormControlLabel
                value={"retail"}
                control={<Radio />}
                label={"Retail"}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        {/* 
        REGION
         */}
        <Grid
          item
          xs={12}
          md={12}
          lg={2}>
          <FormControl
            disabled={version === ""}
            margin="normal"
            component="fieldset">
            <FormLabel component="legend">Region</FormLabel>
            <RadioGroup
              aria-label="region"
              value={region}
              onChange={handleRegionChange}
              row>
              <FormControlLabel
                value="US"
                control={<Radio />}
                label="US"
              />
              <FormControlLabel
                value="EU"
                control={<Radio />}
                label="EU"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        {/* 
        SERVER
         */}
        <Grid
          item
          xs={12}
          md={6}
          lg={4}>
          <FormControl
            margin="normal"
            fullWidth>
            <Autocomplete
              disabled={version === "" || region === ""}
              value={server || null}
              onChange={(event, newValue) => {
                handleServerChange(newValue);
              }}
              options={servers}
              getOptionLabel={(option) => option}
              isOptionEqualToValue={(option, value) => option === value || option.replace(/\s+/g, "-") === value}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Server"
                  variant="outlined"
                />
              )}
            />
          </FormControl>
        </Grid>
        {/* 
        ZONE
         */}
        <Grid
          item
          xs={selectedZone && selectedZone.hasDifficulties ? 7 : 12}
          md={selectedZone && selectedZone.hasDifficulties ? 4 : 6}>
          <FormControl
            margin="normal"
            fullWidth>
            <InputLabel>Zone</InputLabel>
            <Select
              disabled={version === ""}
              value={zones.find((z) => z.id == zone) ? zone : ""}
              label="Zones"
              onChange={handleZoneChange}>
              {zones.map((option) => (
                <MenuItem
                  key={option.id}
                  value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* 
        DIFFICULTY
         */}
        {selectedZone && selectedZone.hasDifficulties ? (
          <Grid
            item
            xs={5}
            md={2}>
            <FormControl
              margin="normal"
              fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                disabled={version === ""}
                value={renderDifficultyMenuItems().find((item) => item.props.value === difficulty) ? difficulty : ""}
                label="difficulty"
                onChange={handleDifficultyChange}>
                {renderDifficultyMenuItems()}
              </Select>
            </FormControl>
          </Grid>
        ) : null}
      </Grid>
    </>
  );
}

Filters.propTypes = {
  version: PropTypes.string.isRequired,
  setVersion: PropTypes.func.isRequired,
  server: PropTypes.string.isRequired,
  setServer: PropTypes.func.isRequired,
  region: PropTypes.string.isRequired,
  setRegion: PropTypes.func.isRequired,
  zone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setZone: PropTypes.func.isRequired,
  difficulty: PropTypes.string.isRequired,
  setDifficulty: PropTypes.func.isRequired,
  updateQueryParams: PropTypes.func.isRequired,
  characters: PropTypes.string.isRequired,
};

export default Filters;
