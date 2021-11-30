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

const GET_APPLICATION_DATA = gql`
query GetApplicationData {
  applicationWithValues(orderBy: APPLICATION_NUMBER_ASC, last: 10) {
    nodes {
      applicationValue
      applicationNumber
      applicationReference
    }
  }
}
`

const ApplicationValueChart = () => {

    const [chartData, setChartData] = React.useState([])

    const { loading } = useQuery(GET_APPLICATION_DATA, {
        onCompleted: data => setChartData(() => data.applicationWithValues.nodes.map(item => ({
            ...item,
            applicationValue: Number(item.applicationValue)
        })))
    })

    if (loading) return <CircularProgress />

    return (
        <div style={{ borderStyle: 'solid', borderWidth: '1px', background: "#f2f2f2" }}>
            <h3 style={{ textDecoration: 'underline' }}>APPLIED VALUE BY APPLICATION</h3>
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
                    <XAxis dataKey="applicationNumber">
                        <Label value="APPLICATION NUMBER" offset={0} position="bottom" />
                    </XAxis>
                    <YAxis tickFormatter={data => formatNumberNoDecimals(data)} allowDataOverflow={true} />
                    <Tooltip formatter={(value, name) => [formatNumberNoDecimals(value), 'Application Value']} />
                    <Bar dataKey="applicationValue" fill="#003300" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ApplicationValueChart;