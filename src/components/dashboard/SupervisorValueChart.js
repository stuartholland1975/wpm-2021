import React from 'react';
import { gql, useQuery } from '@apollo/client'
import { formatNumberNoDecimals } from '../../functions/commonFunctions';

import { CircularProgress } from '@mui/material';
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

const GET_SUPERVISOR_DATA = gql`
query GetSupervisorData {
  supervisorsWithValues {
    nodes {
      supervisorName
      valueComplete
    }
  }
}

`

const SupervisorValueChart = () => {

    const [chartData, setChartData] = React.useState([])

    const { loading } = useQuery(GET_SUPERVISOR_DATA, {
        onCompleted: data => setChartData(() => data.supervisorsWithValues.nodes.map(item => ({
            ...item,
            valueComplete: Number(item.valueComplete)
        })))
    })

    if (loading) return <CircularProgress />

    return (
        <div style={{ borderStyle: 'solid', borderWidth: '1px', background: "#f2f2f2" }}>
            <h3 style={{ textDecoration: 'underline' }}>SUPERVSIOR VALUES</h3>
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
                    <XAxis dataKey="supervisorName">
                        <Label value="SUPERVISOR" offset={0} position="bottom" />
                    </XAxis>
                    <YAxis tickFormatter={data => formatNumberNoDecimals(data)} allowDataOverflow={true} />
                    <Tooltip formatter={(value, name) => [formatNumberNoDecimals(value), 'Supervisor Value']} />
                    <Bar dataKey="valueComplete" fill="#26004d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SupervisorValueChart;