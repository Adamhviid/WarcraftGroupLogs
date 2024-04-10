import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Grid, Typography } from "@mui/material";

import ResultCard from "./ResultCard";
import WclColors from "../../data/wclColors.json";

function Result({ characterData, server, region, zone }) {
    const [groupBestPerformanceAverage, setGroupBestPerformanceAverage] = useState(null);

    useEffect(() => {
        if (!characterData) return;
        setGroupBestPerformanceAverage(characterData.reduce((sum, data) => sum + data.result.dpsRankings.bestPerformanceAverage, 0) / characterData.length);
    }, [characterData]);

    function colorBasedOnRank(number) {
        if (number === null) {
            return "black";
        }
        const rankColorObj = WclColors["rankColors"].find(({ limit }) => number >= limit);
        return rankColorObj ? rankColorObj.color : "black";
    }

    return (
        <>
            {characterData ? (
                <div>
                    <span>Whole Raid Best Performance Average: </span>
                    <Typography
                        variant="body"
                        style={{
                            color: colorBasedOnRank(groupBestPerformanceAverage),
                        }}>
                        {groupBestPerformanceAverage === null ? "N/A" : groupBestPerformanceAverage.toFixed(0)}
                    </Typography>
                    <Grid
                        container
                        spacing={2}>
                        {characterData.map((data, index) => (
                            <Grid
                                item
                                xs={3}
                                key={index}>
                                <ResultCard
                                    key={index}
                                    data={data}
                                    index={index}
                                    server={server}
                                    region={region}
                                    zone={zone}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </div>
            ) : null}
        </>
    );
}

Result.propTypes = {
    characterData: PropTypes.array,
    server: PropTypes.string,
    region: PropTypes.string,
    zone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Result;
