/** @format */

import React from 'react';
import DashboardStats from './DashboardStats';
import { Box, Grid } from '@mui/material';
import WeeklyValueChart from './WeeklyValueChart';
import OrderValueChart from './OrderValueChart';
import ApplicationValueChart from './ApplicationValueChart';
import { useRendersCount } from 'react-use';
import WeeklyValueTable from './WeeklyValueTable';

const ContractDashboard = () => {
	const rendersCount = useRendersCount();
	console.log(rendersCount);

	return (
		<>
			<DashboardStats />
			<Box sx={{ display: 'flex', ml: 1, mr: 1 }}>
				<Grid container spacing={2} mt={1}>
					<Grid item xs={3}>
						<WeeklyValueChart />
					</Grid>
					<Grid item xs={3}>
						<OrderValueChart />
					</Grid>
					<Grid item xs={3}>
						<ApplicationValueChart />
					</Grid>
					<Grid item xs={3}>
						<WeeklyValueChart />
					</Grid>
					<Grid item xs={4}>
						<WeeklyValueTable />
					</Grid>

				</Grid>
			</Box>
		</>
	);
};

export default ContractDashboard;
