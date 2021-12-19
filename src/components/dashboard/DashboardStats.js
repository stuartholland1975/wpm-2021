import React from 'react';
import { gql, useQuery } from '@apollo/client'
import { CircularProgress, Box, Typography } from '@mui/material';
import { formatNumberNoDecimals } from '../../functions/commonFunctions';



const GET_DASHBOARD_STATS = gql`
query GetDashboardStats {
  contractDashboards {
    nodes {
      averagePeriodValue
      contractTotalValueApplied
      contractTotalValueToApply
      contractTotalValueTodo
      currentWeek
      currentYear
      totalContractOrderValue
      totalContractValueComplete
      totalOrdersReceived
    }
  }
}
`

function Item(props) {
    const { sx, ...other } = props;
    return (
        <Box
            sx={{
                bgcolor: '#b4cce4',
                p: 2,
                ml: 0.25,
                mr: 0.25,
                flexGrow: 1,
                borderWidth: 2,
                borderStyle: 'solid',
                ...sx,
            }}
            {...other}
        />
    );
}

const DashboardStats = () => {
    const { data, loading } = useQuery(GET_DASHBOARD_STATS)

    if (loading) return <CircularProgress />

    return (
        <Box sx={{ display: 'flex', ml: 0.5, mr: 0.5, mb: 3, mt: 3, }}>
            <Item>
                <Typography>CONTRACT CURRENT YEAR</Typography>
                <Typography>
                    {data.contractDashboards.nodes[0].currentYear}
                </Typography>
            </Item><Item>
                <Typography>CONTRACT CURRENT WEEK</Typography>
                <Typography>
                    {data.contractDashboards.nodes[0].currentWeek}
                </Typography>
            </Item>
            <Item>
                <Typography>CONTRACT ORDERS RECEIVED</Typography>
                <Typography>
                    {formatNumberNoDecimals(data.contractDashboards.nodes[0].totalOrdersReceived)}
                </Typography>
            </Item>
            <Item>
                <Typography>CONTRACT ORDER VALUE</Typography>
                <Typography>
                    {formatNumberNoDecimals(data.contractDashboards.nodes[0].totalContractOrderValue)}
                </Typography>
            </Item>
            <Item>
                <Typography>CONTRACT COMPLETE VALUE</Typography>
                <Typography>
                    {formatNumberNoDecimals(data.contractDashboards.nodes[0].totalContractValueComplete)}
                </Typography>
            </Item>
            <Item>
                <Typography>CONTRACT TODO VALUE</Typography>
                <Typography>
                    {formatNumberNoDecimals(data.contractDashboards.nodes[0].contractTotalValueTodo)}
                </Typography>
            </Item>
            <Item>
                <Typography>CONTRACT APPLIED VALUE</Typography>
                <Typography>
                    {formatNumberNoDecimals(data.contractDashboards.nodes[0].contractTotalValueApplied)}
                </Typography>
            </Item>
            <Item>
                <Typography>CONTRACT TO APPLY VALUE</Typography>
                <Typography>
                    {formatNumberNoDecimals(data.contractDashboards.nodes[0].contractTotalValueToApply)}
                </Typography>
            </Item>
            <Item>
                <Typography>AVERAGE PERIOD VALUE</Typography>
                <Typography>
                    {formatNumberNoDecimals(data.contractDashboards.nodes[0].averagePeriodValue)}
                </Typography>
            </Item>
        </Box>
    );
};

export default DashboardStats;