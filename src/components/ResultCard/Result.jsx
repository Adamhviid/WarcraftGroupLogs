import PropTypes from "prop-types";
import { Grid } from "@mui/material";

import ResultCard from "./ResultCard";

function Result({ characterData /* server, region, zone  */ }) {
    /* const groupBestPerformanceAverage =
        characterData.reduce(
            (sum, data) => sum + data.result.dpsRankings.bestPerformanceAverage,
            0
        ) / characterData.length; */

    return (
        <>
            {characterData ? (
                <div>
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
    zone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Result;
