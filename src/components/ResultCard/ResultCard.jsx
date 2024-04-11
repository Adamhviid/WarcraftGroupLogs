import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, CardContent, Typography, Divider } from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import BossLogs from "./BossLogs";

import Classes from "../../data/classes.json";
import WclColors from "../../data/wclColors.json";
import DpsIcon from "../../icons/dps.png";
import HealerIcon from "../../icons/healer.png";
import TankIcon from "../../icons/tank.png";

const ResultCard = ({ data, index, server, region, zone }) => {
    const [currentLogs, setCurrentLogs] = useState();
    const [rolesWithLogs, setRolesWithLogs] = useState([]);
    const results = data[zone].result;

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
    }, [results]);

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
        return !(currentLogs.rankings.length === 0 && results.healerRankings.rankings.length === 0 && results.tankRankings.rankings.length === 0);
    }

    return (
        <Card
            key={index}
            sx={{ background: "#3f3f3f" }}>
            {!ifNoLogs ? (
                <></>
            ) : (
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
                                color: Classes[results.classID].color,
                            }}>
                            <a
                                href={`https://sod.warcraftlogs.com/character/${region}/${server}/${data.name}#zone=${zone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "inherit", textDecoration: "none" }}>
                                {data.name}
                            </a>
                            <Divider />
                            <Typography
                                style={{
                                    color: currentLogs ? colorBasedOnRank(currentLogs.bestPerformanceAverage) : "black",
                                }}>
                                {currentLogs ? "Average: " + currentLogs.bestPerformanceAverage.toFixed(0) : null}
                            </Typography>
                            <Typography
                                style={{
                                    color: currentLogs ? colorBasedOnRank(currentLogs.medianPerformanceAverage) : "black",
                                }}>
                                {currentLogs ? "Median: " + currentLogs.medianPerformanceAverage.toFixed(0) : null}
                            </Typography>
                        </Typography>

                        <div style={{ display: "flex", flexDirection: "column" }}>
                            {rolesWithLogs.map((role, index) => (
                                <a
                                    key={index}
                                    onClick={() => handleRoleButton(role.label)}
                                    style={{ backgroundColor: "transparent", cursor: "pointer" }}>
                                    <ArrowRightIcon sx={{ color: currentLogs === results[`${role.label}Rankings`] ? "black" : "#3f3f3f" }} />
                                    <img
                                        src={role.icon}
                                        alt={role.label}
                                    />
                                </a>
                            ))}
                        </div>
                    </div>

                    {currentLogs ? (
                        <BossLogs
                            currentLogs={currentLogs}
                            colorBasedOnRank={colorBasedOnRank}
                        />
                    ) : (
                        <Typography>
                            {data.zone && results.classID === 1 ? "Character have never been logged" : "No logs found for current raid"}
                        </Typography>
                    )}
                </CardContent>
            )}
        </Card>
    );
};

ResultCard.propTypes = {
    data: PropTypes.object,
    index: PropTypes.number,
    server: PropTypes.string,
    region: PropTypes.string,
    zone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ResultCard;
