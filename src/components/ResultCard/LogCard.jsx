import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, CardContent, Typography, Grid } from "@mui/material";

import BossLogs from "./BossLogs";

import Classes from "../../data/classes.json";
import WclColors from "../../data/wclColors.json";

const LogCard = (data, key) => {
    const [currentLogs, setCurrentLogs] = useState();
    const [rolesWithLogs, setRolesWithLogs] = useState([]);
    const [name, setName] = useState(data.data.name);
    const [classID, setClassID] = useState(data.data.result.classID);
    const [results, setResults] = useState(data.data.result);

    useEffect(() => {
        const roles = ["dps", "healer", "tank"];
        let highestBestPerformanceAverage = 0;
        let newRoles = [];

        roles.forEach((role) => {
            const roleRankings = results[`${role}Rankings`];

            if (roleRankings.bestPerformanceAverage != null) {
                newRoles.push(role);

                if (roleRankings.bestPerformanceAverage > highestBestPerformanceAverage) {
                    highestBestPerformanceAverage = roleRankings.bestPerformanceAverage;
                    setCurrentLogs(roleRankings);
                }
            }
        });

        setRolesWithLogs(newRoles);
    }, [data]);

    function colorBasedOnRank(number) {
        const { color } = WclColors["rankColors"].find(({ limit }) => number >= limit);
        return color;
    }

    function handleRoleButton(role) {
        setCurrentLogs(results[`${role}Rankings`]);
    }

    return (
        <Grid
            item
            key={key}
            md={6}>
            <Card key={key}>
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
                                color: Classes[classID].color,
                            }}>
                            {name}
                        </Typography>
                        <div>
                            {rolesWithLogs.map((role, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleRoleButton(role)}>
                                    {role}
                                </button>
                            ))}
                        </div>
                        {/* <Typography
                            variant="p"
                            style={{
                                color: colorBasedOnRank(
                                    results.dpsRankings
                                        .bestPerformanceAverage
                                ),
                            }}>
                            {results.dpsRankings
                                .bestPerformanceAverage === null
                                ? null
                                : "Average: " +
                                  results.dpsRankings.bestPerformanceAverage.toFixed(
                                      1
                                  )}
                        </Typography>
                        <Typography
                            variant="p"
                            style={{
                                color: colorBasedOnRank(
                                    results.dpsRankings
                                        .medianPerformanceAverage
                                ),
                            }}>
                            {results.dpsRankings
                                .medianPerformanceAverage === null
                                ? null
                                : "Median: " +
                                  results.dpsRankings.medianPerformanceAverage.toFixed(
                                      1
                                  )}
                        </Typography> */}
                    </div>

                    {currentLogs ? (
                        <BossLogs
                            currentLogs={currentLogs}
                            colorBasedOnRank={colorBasedOnRank}
                        />
                    ) : null}
                </CardContent>
            </Card>
        </Grid>
    );
};

LogCard.propTypes = {
    data: PropTypes.object,
    index: PropTypes.number,
};

export default LogCard;
