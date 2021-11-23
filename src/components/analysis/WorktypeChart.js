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
import { formatNumberNoDecimals } from '../../functions/commonFunctions';


const WorktypeChart = ({ data }) => {
    console.log(data)
    return (
        <div style={{ borderStyle: 'solid', borderWidth: '1px', background: "#f2f2f2", marginRight: "10px" }}>
            <h3 style={{ textDecoration: 'underline' }}>VALUES BY WORK TYPE</h3>
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
                    <XAxis dataKey="worktype" >
                        <Label value="WORK TYPE" offset={0} position="bottom" />
                    </XAxis>
                    <YAxis tickFormatter={data => formatNumberNoDecimals(data)} allowDataOverflow={true} />
                    <Tooltip formatter={(value, name) => [formatNumberNoDecimals(value), 'Value Complete']} />
                    <Bar dataKey="valueComplete" fill="#660000" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WorktypeChart;