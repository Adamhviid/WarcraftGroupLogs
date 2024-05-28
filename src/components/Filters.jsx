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

/* import sod_image from "../assets/versions/sod.webp";
import retail_image from "../assets/versions/retail.webp";
import cata_image from "../assets/versions/cata.webp"; */

import sod_servers from "../data/servers/sod.json";
import retail_eu_servers from "../data/servers/retail_eu.json";
import retail_us_servers from "../data/servers/retail_us.json";
import classic_eu_servers from "../data/servers/classic_eu.json";
import classic_us_servers from "../data/servers/classic_us.json";

import sod_zones from "../data/zones/sod.json";
import retail_zones from "../data/zones/retail.json";
import classic_zones from "../data/zones/classic.json";

function Filters({ version, setVersion, server, setServer, region, setRegion, zone, setZone, updateQueryParams }) {
    const [servers, setServers] = useState([]);
    const [zones, setZones] = useState([]);

    useEffect(() => {
        switch (version) {
            case "sod":
                setZones(sod_zones);
                setServers(sod_servers);
                break;

            case "classic":
                setZones(classic_zones);
                setServers(region === "EU" ? classic_eu_servers : classic_us_servers);
                break;

            case "retail":
                setZones(retail_zones);
                setServers(region === "EU" ? retail_eu_servers : retail_us_servers);
                break;

            default:
                setZones([]);
                setServers([]);
                break;
        }
        /* setCurrentZone(zones.find((z) => z.id === zone)?.name || ""); */
    }, [region, version]);

    const handleVersionChange = (event) => {
        setVersion(event.target.value);

        setServer("");
        setRegion("");
        setZone("");
        updateQueryParams({
            version: event.target.value,
            server: "",
            region: "",
            zone: "",
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
        setZone(event.target.value);
    };

    /* const RadioOption = ({ value, src, alt }) => (
        <Grid item>
            <FormControlLabel
                value={value}
                control={
                    <Radio
                        icon={
                            <img
                                src={src}
                                alt={alt}
                                style={{ width: "auto", height: "75px" }}
                            />
                        }
                        checkedIcon={
                            <img
                                src={src}
                                alt={alt}
                                style={{ width: "auto", height: "150px", borderRadius: "50%" }}
                            />
                        }
                    />
                }
            />
        </Grid>
    ); */

    return (
        <>
            <Grid
                container
                spacing={2}>
                <Grid
                    item
                    md={12}>
                    <FormControl
                        margin="normal"
                        component="fieldset">
                        <RadioGroup
                            aria-label="version"
                            row
                            value={version}
                            onChange={handleVersionChange}>
                            <Grid container>
                                <FormControlLabel
                                    value={"sod"}
                                    control={<Radio />}
                                    label={"Season of Discovery"}
                                />
                                <FormControlLabel
                                    value={"retail"}
                                    control={<Radio />}
                                    label={"Retail"}
                                />
                                <FormControlLabel
                                    value={"classic"}
                                    control={<Radio />}
                                    label={"Classic Cataclysm"}
                                />
                            </Grid>
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid
                    item
                    md={2}>
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

                <Grid
                    item
                    md={5}>
                    <FormControl
                        margin="normal"
                        fullWidth>
                        <Autocomplete
                            disabled={version === "" || region === ""}
                            value={server}
                            onChange={(event, newValue) => {
                                handleServerChange(newValue);
                            }}
                            options={servers}
                            getOptionLabel={(option) => option}
                            isOptionEqualToValue={(option, value) => value === "" || option.replace(" ", "-") === value}
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
                <Grid
                    item
                    md={5}>
                    <FormControl
                        margin="normal"
                        fullWidth>
                        <InputLabel>Zone</InputLabel>
                        <Select
                            disabled={version === ""}
                            value={zone}
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
    updateQueryParams: PropTypes.func.isRequired,
};

export default Filters;
