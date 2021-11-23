import React from 'react';
import { Box, Typography } from '@mui/material'
import { formatNumberNoDecimals, formatDate } from '../../functions/commonFunctions'

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
const PeriodSummaryData = ({ data }) => {
    return (
        <Box sx={{ display: 'flex', ml: 1, mr: 1, mb: 2 }}>
            <Item>
                <Typography fontWeight='bold' fontSize="20px">Period Number</Typography>
                <Typography fontWeight='bold' fontSize="20px">
                    {data && data[0].periodNumber}
                </Typography>
            </Item>
            <Item>
                <Typography>YEAR</Typography>
                <Typography>
                    {data && data[0].year}
                </Typography>
            </Item>
            <Item>
                <Typography>WEEK</Typography>
                <Typography>
                    {data && data[0].week}
                </Typography>
            </Item>
            <Item>
                <Typography>CLOSED</Typography>
                <Typography>
                    <Typography fontWeight='bold' color={data && data[0].closed ? "navy" : "red"}>{data && data[0].closed ? "TRUE" : "FALSE"}</Typography>
                </Typography>
            </Item>
            <Item>
                <Typography>CURRENT</Typography>
                <Typography>
                    <Typography fontWeight='bold' color={data && data[0].current ? "navy" : "red"}>{data && data[0].current ? "TRUE" : "FALSE"}</Typography>
                </Typography>
            </Item>
            <Item>
                <Typography>WEEK COMMENCING</Typography>
                <Typography>
                    {formatDate(data && data[0].weekCommencingDate)}
                </Typography>
            </Item>
            <Item>
                <Typography>WEEK ENDING</Typography>
                <Typography>
                    {formatDate(data && data[0].weekEndingDate)}
                </Typography>
            </Item>
            <Item>
                <Typography fontWeight='bold'>PERIOD VALUE</Typography>
                <Typography fontWeight='bold'>
                    {formatNumberNoDecimals(data && data[0].worksValueCurrent)}
                </Typography>
            </Item>

        </Box >
    );
};

export default PeriodSummaryData;