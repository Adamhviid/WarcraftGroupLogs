import PropTypes from "prop-types";
import { Typography, Grid } from "@mui/material";

const BossLogs = ({ currentLogs, colorBasedOnRank }) => {
    return (
        <div>
            <Grid
                container
                direction="row"
                wrap="nowrap"
                justify="space-between"
                sx={{ width: "100%" }}>
                {currentLogs.rankings.map((ranking, i) => (
                    <Grid
                        item
                        key={i}
                        md={2}>
                        <Typography
                            variant="body2"
                            component="div">
                            <Grid
                                container
                                direction="column">
                                <Grid item>
                                    <Typography variant="body3">{i + 1}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography
                                        variant="body2"
                                        style={{
                                            color: colorBasedOnRank(ranking.rankPercent),
                                        }}>
                                        {ranking.rankPercent === null ? "N/A" : ranking.rankPercent.toFixed(0)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Typography>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

BossLogs.propTypes = {
    currentLogs: PropTypes.object,
    colorBasedOnRank: PropTypes.func,
};

export default BossLogs;
