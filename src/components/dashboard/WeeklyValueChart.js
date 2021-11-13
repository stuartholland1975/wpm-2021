import React from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  ReferenceLine,
  Area
} from 'recharts';
import {gql, useQuery} from '@apollo/client'
import {CircularProgress} from '@mui/material';
import {formatNumberNoDecimals} from '../../functions/commonFunctions';

const GET_PERIOD_VALUES = gql`
query GetPeriodValues {
 periodWithValues(filter: {closed: {equalTo: true}}, orderBy: PERIOD_NUMBER_ASC) {
    nodes {
      periodNumber
      worksValueClosed
    }
  }
}
`

const WeeklyValueChart = () => {

  const [chartData, setChartData] = React.useState([])

  const {loading} = useQuery(GET_PERIOD_VALUES, {
    onCompleted: data => setChartData(data.periodWithValues.nodes)
  })

  if (loading) return <CircularProgress/>

  return (
    <div style={{borderStyle: 'solid', borderWidth: '1px'}}>
      <h3 style={{textDecoration: 'underline'}}>VALUE BY PERIOD</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="periodNumber"/>
          <YAxis tickFormatter={data => formatNumberNoDecimals(data)}/>
          <Tooltip formatter={(value, name) => [formatNumberNoDecimals(value), 'Period Value']}/>
          <Bar dataKey="worksValueClosed" fill="#4d004d"/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyValueChart;