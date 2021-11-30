import React from 'react';
import {Box, Typography} from '@mui/material'
import {formatDate, formatNumberNoDecimals} from '../../functions/commonFunctions'

function Item(props) {
  const {sx, ...other} = props;
  return (
    <Box
      sx={{
        bgcolor: '#b4cce4',
        p: 2,
        mt: 1,
        ml: 0.25,
        mr: 0.25,
        flexGrow: 1,
        color: 'black',
        ...sx,
      }}
      {...other}
    />
  );
}


const ApplicationStats = ({data}) => {
  return (
    <Box sx={{display: 'flex', ml: 0.5, mr: 0.5}}>
      <Item>
        <Typography>APPLICATION NUMBER</Typography>
        <Typography fontWeight='bold'>{data.applicationNumber}</Typography>
      </Item>
      <Item>
        <Typography>APPLICATION REFERENCE</Typography>
        <Typography fontWeight='bold'>{data.applicationReference}</Typography>
      </Item>
      <Item>
        <Typography>APPLICATION DATE</Typography>
        <Typography>{formatDate(data.applicationDate)}</Typography>
      </Item>
      <Item>
        <Typography>APPLICATION OPEN</Typography>
        <Typography fontWeight='bold'
                    color={data.applicationOpen ? "navy" : "red"}>{data.applicationOpen ? "TRUE" : "FALSE"}</Typography>
      </Item>
      <Item>
        <Typography>APPLICATION SUBMITTED</Typography>
        <Typography fontWeight='bold'
                    color={data.applicationSubmitted ? "navy" : "red"}>{data.applicationSubmitted ? "TRUE" : "FALSE"}</Typography>
      </Item>
      <Item>
        <Typography>APPLICATION CURRENT</Typography>
        <Typography fontWeight='bold'
                    color={data.applicationCurrent ? "navy" : "red"}>{data.applicationCurrent ? "TRUE" : "FALSE"}</Typography>
      </Item>
      <Item>
        <Typography>APPLICATION VALUE</Typography>
        <Typography
          fontWeight='bold'>{formatNumberNoDecimals(data.applicationValue)}</Typography>
      </Item>
      <Item>
        <Typography>ORDER COUNT</Typography>
        <Typography
          fontWeight='bold'>{formatNumberNoDecimals(data.orderCount)}</Typography>
      </Item>
      <Item>
        <Typography>LOCATION COUNT</Typography>
        <Typography
          fontWeight='bold'>{formatNumberNoDecimals(data.locationCount)}</Typography>
      </Item>
      <Item>
        <Typography>ITEM COUNT</Typography>
        <Typography
          fontWeight='bold'>{formatNumberNoDecimals(data.itemCount)}</Typography>
      </Item>
      <Item>
        <Typography>IMAGE COUNT</Typography>
        <Typography
          fontWeight='bold'>{formatNumberNoDecimals(data.imageCount)}</Typography>
      </Item>
      <Item>
        <Typography>AREA COUNT</Typography>
        <Typography
          fontWeight='bold'>{formatNumberNoDecimals(data.areaCount)}</Typography>
      </Item>
    </Box>
  );
};


export default ApplicationStats;