import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, CardContent, Typography, Divider } from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import BossLogs from "./BossLogs";

import Classes from "../../data/classes.json";
import WclColors from "../../data/wclColors.json";
import DpsIcon from "../../assets/icons/dps.png";
import HealerIcon from "../../assets/icons/healer.png";
import TankIcon from "../../assets/icons/tank.png";

const ResultCard = ({ data, index, version, server, region, zone, difficulty }) => {
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
      sx={{ background: "#3f3f3f", minHeight: "145px" }}>
      {!ifNoLogs ? (
        <></>
      ) : (
        <CardContent>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              style={{
                fontWeight: "bold",
                color: Classes[results.classID] ? Classes[results.classID].color : "defaultColor",
              }}>
              <a
                href={`https://${version === "retail" ? "" : version + "."}warcraftlogs.com/character/${region}/${server}/${data.name}?zone=${zone}${
                  zone === 39 ? "" : `#difficulty=${difficulty}`
                }`}
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
                {currentLogs ? "Average: " + currentLogs.bestPerformanceAverage.toFixed(1) : null}
              </Typography>
              {/* <Typography
                                style={{
                                    color: currentLogs ? colorBasedOnRank(currentLogs.medianPerformanceAverage) : "black",
                                }}>
                                {currentLogs ? "Median: " + currentLogs.medianPerformanceAverage.toFixed(0) : null}
                            </Typography> */}
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

          <div style={{ width: "100%" }}>
            {currentLogs ? (
              <BossLogs
                currentLogs={currentLogs}
                colorBasedOnRank={colorBasedOnRank}
                zone={zone}
              />
            ) : (
              <Typography>{results.classID === 0 ? "Character not found" : "No logs  for zone"}</Typography>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

ResultCard.propTypes = {
  data: PropTypes.object,
  index: PropTypes.number,
  version: PropTypes.string,
  server: PropTypes.string,
  region: PropTypes.string,
  zone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  difficulty: PropTypes.string,
};

export default ResultCard;
