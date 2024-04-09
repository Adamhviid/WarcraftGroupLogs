import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, CardContent, Typography } from "@mui/material";

import BossLogs from "./BossLogs";

import Classes from "../../data/classes.json";
import WclColors from "../../data/wclColors.json";
import DpsIcon from "../../icons/dps.png";
import HealerIcon from "../../icons/healer.png";
import TankIcon from "../../icons/tank.png";

const ResultCard = (data, index) => {
    const [currentLogs, setCurrentLogs] = useState();
    const [rolesWithLogs, setRolesWithLogs] = useState([]);
    const name = data.data.name;
    const classID = data.data.result.classID;
    const results = data.data.result;

    useEffect(() => {
        const roles = [
            { label: "dps", icon: DpsIcon },
            { label: "healer", icon: HealerIcon },
            { label: "tank", icon: TankIcon },
        ];
        let highestBestPerformanceAverage = 0;
        let newRoles = [];

        roles.forEach((role) => {
            const roleRankings = results[`${role.label}Rankings`];

            if (roleRankings && roleRankings.bestPerformanceAverage != null) {
                newRoles.push(role);

                if (roleRankings.bestPerformanceAverage > highestBestPerformanceAverage) {
                    highestBestPerformanceAverage = roleRankings.bestPerformanceAverage;
                    setCurrentLogs(roleRankings);
                }
            }
        });
        setRolesWithLogs(newRoles);
    }, [data, results]);

    function colorBasedOnRank(number) {
        if (number === null) {
            return "black";
        }
        const rankColorObj = WclColors["rankColors"].find(({ limit }) => number >= limit);
        return rankColorObj ? rankColorObj.color : "black";
    }

    function handleRoleButton(role) {
        setCurrentLogs(results[`${role}Rankings`]);
    }

    function ifNoLogs() {
        if (results.dpsRankings.rankings.length === 0 && results.healerRankings.rankings.length === 0 && results.tankRankings.rankings.length === 0) {
            true;
        } else {
            false;
        }
    }

    return (
        <Card key={index}>
            {ifNoLogs ? (
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
                                    onClick={() => handleRoleButton(role.label)}
                                    style={{
                                        backgroundColor: currentLogs === results[`${role.label}Rankings`] ? "blue" : "black",
                                    }}>
                                    <img
                                        src={role.icon}
                                        alt={role.label}
                                    />
                                </button>
                            ))}
                        </div>
                        {/* <Typography
                            variant="p"
                            style={{
                                color: colorBasedOnRank(results.dpsRankings.bestPerformanceAverage),
                            }}>
                            {results.dpsRankings.bestPerformanceAverage === null ? null : "Average: " + (results.dpsRankings.bestPerformanceAverage || 0).toFixed(1)}
                        </Typography>
                        <Typography
                            variant="p"
                            style={{
                                color: colorBasedOnRank(results.dpsRankings.medianPerformanceAverage),
                            }}>
                            {results.dpsRankings.medianPerformanceAverage === null ? null : "Median: " + (results.dpsRankings.medianPerformanceAverage || 0).toFixed(1)}
                        </Typography> */}
                    </div>

                    {currentLogs ? (
                        <BossLogs
                            currentLogs={currentLogs}
                            colorBasedOnRank={colorBasedOnRank}
                        />
                    ) : null}
                </CardContent>
            ) : (
                <>hej</>
            )}
        </Card>
    );
};

ResultCard.propTypes = {
    data: PropTypes.object,
    index: PropTypes.number,
};

export default ResultCard;
