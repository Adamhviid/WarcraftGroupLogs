import PropTypes from "prop-types";
import { InputLabel, MenuItem, FormControl, Select, Radio, RadioGroup, FormControlLabel, FormLabel, Grid } from "@mui/material";

function Filters({ server, setServer, region, setRegion, zone, setZone }) {
    const handleServerChange = (event) => {
        setServer(event.target.value);
    };
    const servers = ["Chaos Bolt", "Crusader Strike", "Lava Lash", "Wild Growth", "Living Flame", "Lone Wolf"];

    const handleRegionChange = (event) => {
        setRegion(event.target.value);
    };

    const handleZoneChange = (event) => {
        setZone(event.target.value);
    };
    const zones = [
        { name: "Blackfathom Deeps", id: 2007 },
        { name: "Gnomeregan", id: 2008 },
        { name: "Sunken Temple", id: 2009 },
    ];

    return (
        <>
            <Grid
                container
                spacing={2}>
                <Grid
                    item
                    md={2}>
                    <FormControl
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
                        <InputLabel>Server</InputLabel>
                        <Select
                            value={server}
                            label="Servers"
                            onChange={handleServerChange}>
                            {servers.map((option) => (
                                <MenuItem
                                    key={option}
                                    value={option.replace(" ", "-")}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
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
    server: PropTypes.string.isRequired,
    setServer: PropTypes.func.isRequired,
    region: PropTypes.string.isRequired,
    setRegion: PropTypes.func.isRequired,
    zone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    setZone: PropTypes.func.isRequired,
};

export default Filters;
