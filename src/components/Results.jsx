import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CardActionArea,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

function Results({ characterData, server, region, zone }) {
  if (!characterData) return null;

  function colorBasedOnRank(number) {
    const thresholds = [
      { limit: 100, color: "#e5cc80" },
      { limit: 99, color: "#e268a8" },
      { limit: 95, color: "#ff8000" },
      { limit: 75, color: "#a335ee" },
      { limit: 50, color: "#0070ff" },
      { limit: 25, color: "#1eff00" },
      { limit: 0, color: "#666666" },
    ];

    const { color } = thresholds.find(({ limit }) => number >= limit);
    return color;
  }

  const colorNameBasedOnId = (id) => {
    const colors = {
      2: "#FF7C0A",
      3: "#AAD372",
      4: "#3FC7EB",
      7: "#FFFFFF",
      8: "#FFF468",
      9: "#0070DD",
      10: "#8788EE",
      11: "#C69B6D",
    };
    return colors[id];
  };

  const groupBestPerformanceAverage =
    characterData.reduce(
      (sum, data) => sum + data.result.zoneRankings.bestPerformanceAverage,
      0
    ) / characterData.length;

  return (
    <>
      {characterData && (
        <div>
          <div>
            <span>Group Best Performance Average: </span>
            <Typography
              variant="body"
              style={{
                color: colorBasedOnRank(groupBestPerformanceAverage),
              }}
            >
              {groupBestPerformanceAverage === null
                ? "N/A"
                : groupBestPerformanceAverage.toFixed(1)}
            </Typography>
          </div>
          <Grid container spacing={2}>
            {characterData.map((data, index) => (
              <Grid item key={index} md={6}>
                <Card key={index}>
                  <CardActionArea
                    component="a"
                    href={`https://sod.warcraftlogs.com/character/${region}/${server}/${data.name}#zone=${zone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CardContent>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="div"
                          style={{
                            fontWeight: "bold",
                            color: colorNameBasedOnId(data.result.classID),
                          }}
                        >
                          {data.name} {/* <OpenInNewIcon fontSize="small" /> */}
                        </Typography>
                        <Typography
                          variant="p"
                          style={{
                            color: colorBasedOnRank(
                              data.result.zoneRankings.bestPerformanceAverage
                            ),
                          }}
                        >
                          Average:{" "}
                          {data.result.zoneRankings.bestPerformanceAverage ===
                          null
                            ? "N/A"
                            : data.result.zoneRankings.bestPerformanceAverage.toFixed(
                                1
                              )}
                        </Typography>
                        <Typography
                          variant="p"
                          style={{
                            color: colorBasedOnRank(
                              data.result.zoneRankings.medianPerformanceAverage
                            ),
                          }}
                        >
                          Median:{" "}
                          {data.result.zoneRankings.medianPerformanceAverage ===
                          null
                            ? "N/A"
                            : data.result.zoneRankings.medianPerformanceAverage.toFixed(
                                1
                              )}
                        </Typography>
                      </div>

                      {data.result.zoneRankings ? (
                        <Grid
                          container
                          direction="row"
                          wrap="nowrap"
                          justify="space-between"
                          sx={{ width: "100%" }}
                        >
                          {data.result.zoneRankings.rankings.map(
                            (ranking, i) => (
                              <Grid item key={i} md={2}>
                                <Typography variant="body2" component="div">
                                  <Grid container direction="column">
                                    <Grid item>
                                      <Typography variant="body3">
                                        Boss{i + 1}
                                      </Typography>
                                    </Grid>
                                    <Grid item>
                                      <Typography
                                        variant="body2"
                                        style={{
                                          color: colorBasedOnRank(
                                            ranking.rankPercent
                                          ),
                                        }}
                                      >
                                        {ranking.rankPercent === null
                                          ? "N/A"
                                          : ranking.rankPercent.toFixed(1)}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Typography>
                              </Grid>
                            )
                          )}
                        </Grid>
                      ) : null}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </>
  );
}

Results.propTypes = {
  characterData: PropTypes.array,
  server: PropTypes.string,
  region: PropTypes.string,
  zone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Results;
