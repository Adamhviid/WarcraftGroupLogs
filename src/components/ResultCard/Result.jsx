/* import { useState, useEffect } from "react"; */
import PropTypes from "prop-types";
import {
    /*  Card,
    CardContent,
    Typography, */
    Grid,
    /* CardActionArea, */
} from "@mui/material";

/* import BossLogs from "./BossLogs";

import Classes from "../../data/classes.json";
import WclColors from "../../data/wclColors.json"; */

import LogCard from "./LogCard";

function Result({ characterData /* server, region, zone  */ }) {
    /* const groupBestPerformanceAverage =
        characterData.reduce(
            (sum, data) => sum + data.result.dpsRankings.bestPerformanceAverage,
            0
        ) / characterData.length; */

    /* const getMultipleRankings = () => {
        characterData.forEach((data) => {
            ["dpsRankings", "healerRankings", "tankRankings"].forEach(
                (ranking) => {
                    console.log(
                        ranking +
                            " = " +
                            data.result[ranking].bestPerformanceAverage
                    );
                }
            );
        });
    };

    getMultipleRankings(); */

    return (
        <>
            {characterData && (
                <div>
                    <Grid
                        container
                        spacing={2}>
                        {characterData.map((data, index) => (
                            <LogCard
                                data={data}
                                key={index}
                            />
                        ))}
                    </Grid>
                </div>
            )}
        </>
    );
}

Result.propTypes = {
    characterData: PropTypes.array,
    server: PropTypes.string,
    region: PropTypes.string,
    zone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Result;
