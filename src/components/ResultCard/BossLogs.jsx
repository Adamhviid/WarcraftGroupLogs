import React from "react";
import PropTypes from "prop-types";
import { Typography, Grid, Divider } from "@mui/material";

const BossLogs = ({ currentLogs, colorBasedOnRank, zone }) => {
    return (
        <div>
            {zone == 1023 ? (
                <Grid
                    container
                    direction="row"
                    wrap="nowrap"
                    justify="space-between"
                    sx={{ width: "100%" }}>
                    <Grid
                        item
                        md={2}>
                        <Typography variant="body2">TotFW</Typography>
                    </Grid>
                    <Grid
                        item
                        md={6}>
                        <Typography variant="body2">BWD</Typography>
                    </Grid>
                    <Grid
                        item
                        md={4}>
                        <Typography variant="body2">BoT</Typography>
                    </Grid>
                </Grid>
            ) : null}
            <Grid
                container
                direction="row"
                wrap="nowrap"
                justify="space-between"
                sx={{ width: "100%" }}>
                {currentLogs.rankings.map((ranking, i) => (
                    <React.Fragment key={i}>
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
                                            {ranking.rankPercent === null ? "" : ranking.rankPercent.toFixed(0)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Typography>
                        </Grid>
                        {zone == 1023 ? (
                            <>
                                {i !== undefined && [1, 7].includes(i) && (
                                    <Grid item>
                                        <Divider
                                            orientation="vertical"
                                            flexItem
                                            style={{ height: "100%", backgroundColor: "white" }}
                                        />
                                    </Grid>
                                )}
                            </>
                        ) : null}
                    </React.Fragment>
                ))}
            </Grid>
        </div>
    );
};

BossLogs.propTypes = {
    currentLogs: PropTypes.object,
    colorBasedOnRank: PropTypes.func,
    zone: PropTypes.number,
};

export default BossLogs;
