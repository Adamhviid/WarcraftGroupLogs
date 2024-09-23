import React from "react";
import PropTypes from "prop-types";
import { Typography, Grid, Divider } from "@mui/material";

const BossLogs = ({ currentLogs, colorBasedOnRank }) => {
  //warcraftlogs rounds down no matter what
  const roundDown = (num) => {
    return Math.floor(num);
  };

  return (
    <div>
      <Grid
        container
        direction="row"
        wrap="nowrap"
        justify="space-between">
        {currentLogs.rankings.map((ranking, i) => (
          <React.Fragment key={i}>
            <Grid
              item
              key={i}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={2}>
              <Typography
                variant="body2"
                component="div">
                <Grid
                  container
                  direction="column">
                  <Grid item>
                    <Typography variant="body3">{i + 1}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="body2"
                      style={{
                        color: colorBasedOnRank(ranking.rankPercent),
                      }}>
                      {ranking.rankPercent === null ? "" : roundDown(ranking.rankPercent)}
                    </Typography>
                  </Grid>
                </Grid>
              </Typography>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </div>
  );
};

BossLogs.propTypes = {
  currentLogs: PropTypes.object,
  colorBasedOnRank: PropTypes.func,
};

export default BossLogs;
