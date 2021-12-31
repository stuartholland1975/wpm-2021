/** @format */

import React from 'react';
import DashboardStats from './DashboardStats';
import { Box, Grid } from '@mui/material';
import WeeklyValueChart from './WeeklyValueChart';
import OrderValueChart from './OrderValueChart';
import ApplicationValueChart from './ApplicationValueChart';
import { useRendersCount } from 'react-use';
import AreaValueChart from './AreaValueChart';
import SupervisorValueChart from './SupervisorValueChart';

const ContractDashboard = () => {
	const rendersCount = useRendersCount();

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
						<AreaValueChart />
					</Grid>
					<Grid item xs={3}>
						<SupervisorValueChart />
					</Grid>
				</Grid>
			</Box>
		</>
	);
};

export default ContractDashboard;
