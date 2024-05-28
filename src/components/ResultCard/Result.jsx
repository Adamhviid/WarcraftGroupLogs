import { /* useState, */ useEffect } from "react";
import PropTypes from "prop-types";
import { Grid /* Typography */ } from "@mui/material";

import ResultCard from "./ResultCard";
/* import WclColors from "../../data/wclColors.json"; */

function Result({ characterData, version, server, region, zone }) {
    /* const [groupBestPerformanceAverage, setGroupBestPerformanceAverage] = useState(null); */

    useEffect(() => {
        /* if (!characterData) return; */
        //TODO: make it work for the highest ranking, not only dpsranking
        /* setGroupBestPerformanceAverage(
            characterData.reduce((sum, data) => sum + data[zone].result.dpsRankings.bestPerformanceAverage, 0) / characterData.length
        ); */
    }, [characterData, server, region]);

    /* function colorBasedOnRank(number) {
        if (number === null) {
        }
        return "black";
        const rankColorObj = WclColors["rankColors"].find(({ limit }) => number >= limit);
        return rankColorObj ? rankColorObj.color : "black";
    } */

    return (
        <>
            {characterData ? (
                <div>
                    {/* <Typography
                    <span>Whole Raid Best Performance Average: </span>
                        variant="body"
                        style={{
                            color: colorBasedOnRank(groupBestPerformanceAverage),
                        }}>
                        {groupBestPerformanceAverage === null ? "N/A" : groupBestPerformanceAverage.toFixed(0)}
                    </Typography> */}
                    <Grid
                        container
                        spacing={2}>
                        {characterData.map((data, index) => (
                            <Grid
                                item
                                xs={3}
                                key={index}>
                                {data[zone] != null ? (
                                    <ResultCard
                                        key={index}
                                        data={data}
                                        index={index}
                                        version={version}
                                        server={server}
                                        region={region}
                                        zone={zone}
                                    />
                                ) : null}
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
    version: PropTypes.string,
    server: PropTypes.string,
    region: PropTypes.string,
    zone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Result;
