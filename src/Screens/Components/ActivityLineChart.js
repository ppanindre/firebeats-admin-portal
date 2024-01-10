import React from 'react';
import moment from 'moment';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryLabel } from 'victory';

const CHART_HEIGHT = 300;

const ACTIVITIES = ['None', 'Idle', 'Light', 'Active', 'Intense'];

const ActivityLineChart = ({ data, useTimestamp = false, loading = false, isNotification = false }) => {
  return (
    <div>
      <VictoryChart
        height={CHART_HEIGHT}
        domain={{ y: [1, 4], x: data.length === 0 ? [0, 1440] : useTimestamp ? null : [0, 1440] }}
        padding={{ top: 80, bottom: 40, left: 30, right: 60 }}
        theme={VictoryTheme.material}
      >
        <VictoryLine
          animate={{ onLoad: { duration: 600 } }}
          style={{
            grid: { stroke: 'none' },
            data: {  strokeWidth: 3 },
          }}
          interpolation={'stepAfter'}
          data={data}
        />

        <VictoryAxis
          tickLabelComponent={<VictoryLabel textAnchor={'end'} />}
          style={{
            tickLabels: { fontSize: 11, margin: 4, fontWeight: 'bold' },
            axis: { stroke: 'none' },
            grid: { stroke: 'transparent' },
            ticks: { stroke: 'transparent' },
          }}
          tickFormat={(value) =>
            useTimestamp
              ? moment(value).format('HH:mm')
              : moment().startOf('d').add(value, 'minute').format('HH:mm')
          }
          tickCount={isNotification ? 5 : 5}
        />

        {data.length === 0 && !loading ? (
          <VictoryLabel
            x={window.innerWidth / 2.1}
            y={CHART_HEIGHT / 2}
            textAnchor={'middle'}
            text={'No Data'}
            style={{ fontSize: 16, fontWeight: 'bold', fontFamily: 'Roboto' }}
          />
        ) : null}
        {loading ? (
          <VictoryLabel
            x={window.innerWidth / 2.1}
            y={CHART_HEIGHT / 2}
            textAnchor={'middle'}
            text={'Loading'}
            style={{ fontSize: 16, fontWeight: 'bold', fontFamily: 'Roboto' }}
          />
        ) : null}
        <VictoryAxis
          tickLabelComponent={<VictoryLabel textAnchor="start" />}
          tickCount={3}
          tickFormat={(value) => {
            return ACTIVITIES[value];
          }}
          crossAxis={false}
          dependentAxis
          style={{
            axis: { stroke: 'none' },
            grid: { stroke: 'none' },
            ticks: { stroke: 'transparent' },
            tickLabels: { angle: -90, fontSize: 11, margin: 4, fontWeight: 'bold' },
          }}
        />
      </VictoryChart>
    </div>
  );
};

export default ActivityLineChart;
