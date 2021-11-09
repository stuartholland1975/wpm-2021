import React from 'react';
import { Box, Typography } from '@mui/material'
import { formatDate, formatNumberNoDecimals } from '../../functions/commonFunctions'

function Item(props) {
    const { sx, ...other } = props;
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



const CurrentApplication = ({ data }) => {
    return (
        <Box sx={{ display: 'flex', ml: 0.5, mr: 0.5 }}>
            <Item>
                <Typography>APPLICATION NUMBER</Typography>
                <Typography fontWeight='bold'>{data.applicationWithValues.nodes[0].applicationNumber}</Typography>
            </Item>
            <Item>
                <Typography >APPLICATION REFERENCE</Typography>
                <Typography fontWeight='bold'>{data.applicationWithValues.nodes[0].applicationReference}</Typography>
            </Item>
            <Item>
                <Typography>APPLICATION DATE</Typography>
                <Typography>{formatDate(data.applicationWithValues.nodes[0].applicationDate)}</Typography>
            </Item>
            <Item>
                <Typography>APPLICATION OPEN</Typography>
                <Typography fontWeight='bold' color={data.applicationWithValues.nodes[0].applicationOpen ? "navy" : "red"}>{data.applicationWithValues.nodes[0].applicationOpen ? "TRUE" : "FALSE"}</Typography>
            </Item>
            <Item>
                <Typography>APPLICATION SUBMITTED</Typography>
                <Typography fontWeight='bold' color={data.applicationWithValues.nodes[0].applicationSubmitted ? "navy" : "red"}>{data.applicationWithValues.nodes[0].applicationSubmitted ? "TRUE" : "FALSE"}</Typography>
            </Item>
            <Item>
                <Typography>APPLICATION CURRENT</Typography>
                <Typography fontWeight='bold' color={data.applicationWithValues.nodes[0].applicationCurrent ? "navy" : "red"}>{data.applicationWithValues.nodes[0].applicationCurrent ? "TRUE" : "FALSE"}</Typography>
            </Item>
            <Item>
                <Typography>APPLICATION VALUE</Typography>
                <Typography fontWeight='bold'>{formatNumberNoDecimals(data.applicationWithValues.nodes[0].applicationValue)}</Typography>
            </Item>
            <Item>
                <Typography>ORDER COUNT</Typography>
                <Typography fontWeight='bold'>{formatNumberNoDecimals(data.applicationWithValues.nodes[0].orderCount)}</Typography>
            </Item>
            <Item>
                <Typography>LOCATION COUNT</Typography>
                <Typography fontWeight='bold'>{formatNumberNoDecimals(data.applicationWithValues.nodes[0].locationCount)}</Typography>
            </Item>
            <Item>
                <Typography>ITEM COUNT</Typography>
                <Typography fontWeight='bold'>{formatNumberNoDecimals(data.applicationWithValues.nodes[0].itemCount)}</Typography>
            </Item>
            <Item>
                <Typography>IMAGE COUNT</Typography>
                <Typography fontWeight='bold'>{formatNumberNoDecimals(data.applicationWithValues.nodes[0].imageCount)}</Typography>
            </Item>
        </Box>
    );
};



export default CurrentApplication;