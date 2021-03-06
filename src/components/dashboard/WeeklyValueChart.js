import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label
} from 'recharts';
import { gql, useQuery } from '@apollo/client'
import { CircularProgress } from '@mui/material';
import { formatNumberNoDecimals } from '../../functions/commonFunctions';

const GET_PERIOD_VALUES = gql`
query GetPeriodValues {
 periodWithValues(filter: {worksValueCurrent: {greaterThan: "0"}}
    last: 10
    orderBy: PERIOD_NUMBER_ASC) {
    nodes {
      periodNumber
      worksValueCurrent
    }
  }
}
`

/* const GET_PERIOD_AREA_VALUES = gql`
query GetPeriodAreaValues($period: Int!) {
  commercialValuesByPeriodAndAreas(
    filter: { periodNumber: { equalTo: $period } }
  ) {
    nodes {
      area
      periodNumber
      periodValue
    }
  }
}
` */

const WeeklyValueChart = () => {

  const [chartData, setChartData] = React.useState([])

  const { loading } = useQuery(GET_PERIOD_VALUES, {
    onCompleted: data => setChartData(() => data.periodWithValues.nodes.map(item => ({
      ...item,
      worksValueCurrent: Number(item.worksValueCurrent)
    })))
  })

  if (loading) return <CircularProgress />

  return (
    <div style={{ borderStyle: 'solid', borderWidth: '1px', background: "#f2f2f2" }}>
      <h3 style={{ textDecoration: 'underline' }}>VALUE COMPLETE BY PERIOD</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 25,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="periodNumber">
            <Label value="PERIOD NUMBER" offset={0} position="bottom" />
          </XAxis>
          <YAxis tickFormatter={data => formatNumberNoDecimals(data)} />
          <Tooltip formatter={(value, name) => [formatNumberNoDecimals(value), 'Period Value']} />
          <Bar dataKey="worksValueCurrent" fill="#4d004d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyValueChart;