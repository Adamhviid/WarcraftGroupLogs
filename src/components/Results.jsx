import PropTypes from "prop-types";
import { Card, CardContent, Typography, Grid } from "@mui/material";

function Results({ characterData }) {
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

  return (
    <>
      {characterData && (
        <div>
          <Grid container spacing={2}>
            {characterData.map((data, index) => (
              <Grid item key={index} md={6}>
                <Card key={index}>
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
                        style={{ fontWeight: "bold" }}
                      >
                        {data.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{
                          color: colorBasedOnRank(
                            data.result.bestPerformanceAverage
                          ),
                        }}
                      >
                        Average: {data.result.bestPerformanceAverage.toFixed(1)}
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{
                          color: colorBasedOnRank(
                            data.result.medianPerformanceAverage
                          ),
                        }}
                      >
                        Median:{" "}
                        {data.result.medianPerformanceAverage.toFixed(1)}
                      </Typography>
                    </div>

                    {data.result ? (
                      <Grid
                        container
                        direction="row"
                        wrap="nowrap"
                        justify="space-between"
                        sx={{ width: "100%" }}
                      >
                        {data.result.rankings.map((ranking, i) => (
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
                                        ranking.rankPercent.toFixed(1)
                                      ),
                                    }}
                                  >
                                    {ranking.rankPercent ? (
                                      ranking.rankPercent.toFixed(1)
                                    ) : (
                                      <Typography>null</Typography>
                                    )}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    ) : null}
                  </CardContent>
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
};

export default Results;
