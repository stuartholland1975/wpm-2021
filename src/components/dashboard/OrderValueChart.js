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

  const {loading} = useQuery(GET_ORDER_VALUES, {
    onCompleted: data => setChartData(data.orderheaderWithValues.nodes.map(item => ({
      ...item,
      orderValueTotal: Number(item.orderValueTotal)
    })))
  })

  if (loading) return <CircularProgress/>

  return (
    <div style={{borderStyle: 'solid', borderWidth: '1px'}}>
      <h3 style={{textDecoration: 'underline'}}>ORDER VALUES BY ORDER NUMBER</h3>
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
          <XAxis dataKey="orderNumber"/>
          <YAxis tickFormatter={data => formatNumberNoDecimals(data)} allowDataOverflow={false}/>
          <Tooltip formatter={(value, name) => [formatNumberNoDecimals(value), 'Order Value']}/>
          <Bar dataKey="orderValueTotal" fill="#00004d"/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderValueChart;