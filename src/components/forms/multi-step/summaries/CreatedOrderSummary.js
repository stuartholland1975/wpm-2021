import React from 'react';
import { Box, Typography } from '@mui/material';

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


const CreatedOrderSummary = ({ data }) => {

    return (
        <Box sx={{ display: 'flex', ml: 0.5, mr: 0.5 }}>
            <Item>
                <Typography>ORDER NO</Typography>
                <Typography>{data.orderNumber}</Typography>
            </Item>
            <Item>
                <Typography>PROJECT</Typography>
                <Typography>
                    {data.projectTitle}
                </Typography>
            </Item>
        </Box>
    );

};



export default CreatedOrderSummary;