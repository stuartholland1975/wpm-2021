import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Label
} from 'recharts';
import { gql, useQuery } from '@apollo/client'
import { CircularProgress } from '@mui/material';
import { formatNumberNoDecimals } from '../../functions/commonFunctions';

const GET_ORDER_VALUES = gql`
query GetOrderValues {
  orderheaderWithValues(filter: {orderValueTotal: {greaterThan: "0"}} orderBy: ORDER_NUMBER_ASC) {
    nodes {
      orderNumber
      orderValueTotalComplete
      orderValueTotal
    }
  }
}
`

const OrderValueChart = () => {

  const [chartData, setChartData] = React.useState([])

  const { loading } = useQuery(GET_ORDER_VALUES, {
    onCompleted: data => setChartData(data.orderheaderWithValues.nodes.map(item => ({
      ...item,
      "Value Outstanding": Number(item.orderValueTotal) - Number(item.orderValueTotalComplete),
      "Value Complete": Number(item.orderValueTotalComplete),
      orderValueTotal: formatNumberNoDecimals(item.orderValueTotal)
    })))
  })

  if (loading) return <CircularProgress />

  return (
    <div style={{ borderStyle: 'solid', borderWidth: '1px', background: "#f2f2f2" }}>
      <h3 style={{ textDecoration: 'underline' }}>ORDER VALUE BY ORDER NUMBER</h3>
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
          <XAxis dataKey="orderNumber">
            <Label value="ORDER NUMBER" offset={0} position="bottom" />
          </XAxis>
          <YAxis tickFormatter={data => formatNumberNoDecimals(data)} allowDataOverflow={false} />
          <Tooltip formatter={value => formatNumberNoDecimals(value)} />
          <Bar dataKey="Value Complete" fill="#00004d" stackId="a" />
          <Bar dataKey="Value Outstanding" fill="#4d4d4d" stackId="a">
            <LabelList dataKey="orderValueTotal" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderValueChart;