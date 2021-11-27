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
import { formatNumberNoDecimals, getFirstLetters } from '../../functions/commonFunctions';


const SupervisorChart = ({ data }) => {
    console.log(data)
    return (
        <div style={{ borderStyle: 'solid', borderWidth: '1px', background: "#f2f2f2" }}>
            <h3 style={{ textDecoration: 'underline' }}>TOP 10 VALUES BY SUPERVISOR</h3>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 25,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="supervisorName" tickFormatter={value => value && getFirstLetters(value)} >
                        <Label value="SUPERVISOR NAME" offset={0} position="bottom" />
                    </XAxis>
                    <YAxis tickFormatter={data => formatNumberNoDecimals(data)} allowDataOverflow={true} />
                    <Tooltip formatter={(value, name) => [formatNumberNoDecimals(value), 'Period Value']} />
                    <Bar dataKey="valueComplete" fill="#330033" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SupervisorChart;