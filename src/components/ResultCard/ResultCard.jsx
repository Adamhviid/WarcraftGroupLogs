import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
    Card,
    CardContent,
    Typography,
    Grid,
    /* CardActionArea, */
} from "@mui/material";

import BossLogs from "./BossLogs";

import Classes from "../../data/classes.json";
import WclColors from "../../data/wclColors.json";

function ResultCard({ characterData /* server, region, zone  */ }) {
    const [currentLogs, setCurrentLogs] = useState(null);
    const [rolesWithLogs, setRolesWithLogs] = useState([]);

    useEffect(() => {
        if (characterData) {
            console.log(characterData);
            /* setCurrentLogs(characterData[0].result.dpsRankings); */

            let newRoles = [];
            if (
                characterData[0].result.healerRankings.bestPerformanceAverage !=
                null
            ) {
                newRoles.push("healer");
            }
            if (
                characterData[0].result.tankRankings.bestPerformanceAverage !=
                null
            ) {
                newRoles.push("tank");
            }
            if (
                characterData[0].result.dpsRankings.bestPerformanceAverage !=
                null
            ) {
                newRoles.push("dps");
            }
            setRolesWithLogs(newRoles);
        }
    }, [characterData]);

    function colorBasedOnRank(number) {
        const { color } = WclColors["rankColors"].find(
            ({ limit }) => number >= limit
        );
        return color;
    }

    function handleRoleButton(role) {
        setCurrentLogs(characterData[0].result[`${role}Rankings`]);
    }

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
                            <Grid
                                item
                                key={index}
                                md={6}>
                                <Card key={index}>
                                    {/* <CardActionArea
                                        component="a"
                                        href={`https://sod.warcraftlogs.com/character/${region}/${server}/${data.name}#zone=${zone}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    > */}
                                    <CardContent>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}>
                                            <Typography
                                                gutterBottom
                                                variant="h5"
                                                component="div"
                                                style={{
                                                    fontWeight: "bold",
                                                    color: Classes[
                                                        data.result.classID
                                                    ].color,
                                                }}>
                                                {data.name}
                                            </Typography>
                                            <div>
                                                {rolesWithLogs.map(
                                                    (role, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() =>
                                                                handleRoleButton(
                                                                    role
                                                                )
                                                            }>
                                                            {role}
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                            {/* <Typography
                                                    variant="p"
                                                    style={{
                                                        color: colorBasedOnRank(
                                                            data.result
                                                                .dpsRankings
                                                                .bestPerformanceAverage
                                                        ),
                                                    }}
                                                >
                                                    {data.result.dpsRankings
                                                        .bestPerformanceAverage ===
                                                    null
                                                        ? null
                                                        : "Average: " +
                                                          data.result.dpsRankings.bestPerformanceAverage.toFixed(
                                                              1
                                                          )}
                                                </Typography>
                                                <Typography
                                                    variant="p"
                                                    style={{
                                                        color: colorBasedOnRank(
                                                            data.result
                                                                .dpsRankings
                                                                .medianPerformanceAverage
                                                        ),
                                                    }}
                                                >
                                                    {data.result.dpsRankings
                                                        .medianPerformanceAverage ===
                                                    null
                                                        ? null
                                                        : "Median: " +
                                                          data.result.dpsRankings.medianPerformanceAverage.toFixed(
                                                              1
                                                          )}
                                                </Typography> */}
                                        </div>

                                        {currentLogs ? (
                                            <BossLogs
                                                currentLogs={currentLogs}
                                                colorBasedOnRank={
                                                    colorBasedOnRank
                                                }
                                            />
                                        ) : null}
                                    </CardContent>
                                    {/*  </CardActionArea> */}
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            )}
        </>
    );
}

ResultCard.propTypes = {
    characterData: PropTypes.array,
    server: PropTypes.string,
    region: PropTypes.string,
    zone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ResultCard;
