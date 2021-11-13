import React from 'react';
import DashboardStats from './DashboardStats'
import {Box, Grid} from '@mui/material'
import WeeklyValueChart from './WeeklyValueChart';

const ContractDashboard = () => {


  return (
    <>
      <DashboardStats/>
      <Box sx={{display: 'flex', ml: 0.5, mr: 0.5}}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={4}>
            <WeeklyValueChart/>
          </Grid>
          <Grid item xs={4}>
            <WeeklyValueChart/>
          </Grid>
          <Grid item xs={4}>
            <WeeklyValueChart/>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ContractDashboard;