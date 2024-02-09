import React from "react";
import moment from "moment";
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryAxis,
  VictoryLabel,
} from "victory";

const CHART_HEIGHT = 300;

const SLEEP_TYPE = ["Deep", "Light", "REM", "Awake"];

const SleepChart = ({ data = [], loading = false }) => {
  const unique = [...new Set(data)];
  console.log("sleep data");
  console.log(data);

  return (
    <div>
      <VictoryChart
        domain={{
          y: [1, 5],
          x: data?.length <= 10 || unique?.length === 1 ? [0, 1440] : null,
        }}
        minDomain={{ y: 1 }}
        padding={{ top: 0, bottom: 40, left: 30, right: 60 }}
        theme={VictoryTheme.material}
      >
        <VictoryLine
          style={{
            grid: { stroke: "none" },
            data: { strokeWidth: 3 },
          }}
          interpolation={"stepAfter"}
          data={data?.length > 10 && unique.length > 1 ? data : []}
        />
        <VictoryAxis
          tickLabelComponent={<VictoryLabel textAnchor="end" />}
          tickFormat={(value) =>
            moment().startOf("d").add(value, "minute").format("HH:mm")
          }
          tickCount={5}
          style={{
            tickLabels: { fontSize: 11, margin: 4, fontWeight: "bold" },
            axis: { stroke: "none" },
            grid: { stroke: "transparent" },
            ticks: { stroke: "transparent" },
          }}
          fixLabelOverlap
        />
        {data?.length <= 10 || unique.length === 1 ? (
          <VictoryLabel
            //   x={document.documentElement.clientWidth / 2.1}
            //   y={CHART_HEIGHT / 2}
            textAnchor={"middle"}
            text={"No Data"}
            //   style={{ fontSize: 16, fontWeight: 'bold', fontFamily: 'Roboto' }}
          />
        ) : null}
        {loading ? (
          <VictoryLabel
            //   x={document.documentElement.clientWidth / 2.1}
            //   y={CHART_HEIGHT / 2}
            textAnchor={"middle"}
            text={"Loading"}
            style={{ fontSize: 16, fontWeight: "bold", fontFamily: "Roboto" }}
          />
        ) : null}
        <VictoryAxis
          tickLabelComponent={<VictoryLabel textAnchor="start" />}
          tickValues={SLEEP_TYPE}
          crossAxis={false}
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
            },
          }}
        />
      </VictoryChart>
    </div>
  );
};

export default SleepChart;
