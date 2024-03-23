// HeartRateChart.js
import React from "react";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryLabel,
  VictoryTheme,
} from "victory";
// import { Defs, Stop, LinearGradient } from 'react-native-svg'

import moment from "moment";

const Chart = ({ heartRates }) => {
  console.log(heartRates);
  return (
    <div>
      <VictoryChart theme={VictoryTheme.material}>
        <VictoryLine
          style={{
            data: { stroke: "#c43a31" },
            parent: { border: "1px solid #ccc" },
          }}
          data={(heartRates ?? []).map((val) => ({
            x: val?.timeStamp,
            y: val?.heartRate,
          }))}
        />

        <VictoryAxis
          axisLabelComponent={<VictoryLabel style={{ fontSize: 10 }} />}
          tickLabelComponent={<VictoryLabel textAnchor="end" />}
          tickCount={4}
          fixLabelOverlap
          dependentAxis
          style={{
            axis: { stroke: "none" },
            grid: { stroke: "none" },
            ticks: { stroke: "transparent" },
            tickLabels: {
              angle: -90,
              fontSize: 11,
              margin: 4,
              fontWeight: "bold",
              color: "black",
              fontFamily: "Roboto",
            },
          }}
        />
        {(heartRates?.length ?? 0) !== 0 && (
          <VictoryAxis
            style={{
              tickLabels: {
                fontSize: 11,
                margin: 4,
                fontWeight: "bold",
                fontFamily: "Roboto",
              },
              axis: { stroke: "none" },
              grid: { stroke: "transparent" },
              ticks: { stroke: "transparent" },
            }}
            tickFormat={(value) => moment(value, "HH:mm:ss").format("HH:mm")}
            tickCount={5}
            fixLabelOverlap
          />
        )}
      </VictoryChart>
    </div>
  );
};

export default Chart;
