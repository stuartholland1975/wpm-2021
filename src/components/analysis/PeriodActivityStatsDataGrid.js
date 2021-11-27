import { DataGrid } from '@mui/x-data-grid'
import React from 'react';
import { makeStyles } from '@mui/styles';

const columns = [

    { field: 'activityCode', headerName: 'Activity Code', width: 150 },
    { field: 'activityDescription', headerName: 'Activity Description', width: 350 },
    { field: 'qtyComplete', headerName: 'Qty Complete', type: 'number', width: 150 },
    { field: 'valueComplete', headerName: 'Value Complete', type: 'number', width: 200 },
]

const useStyles = makeStyles({
    root: {
        background: "#f2f2f2 ",
        borderWidth: 1,
        borderColor: 'black'
    }
})


const PeriodActivityStats = ({ data }) => {

    const classes = useStyles()

    return (
        <div style={{ height: 375, width: '100%' }}>
            <h3 style={{ textDecoration: 'underline' }}>VALUES BY ACTIVITY</h3>
            <DataGrid
                className={classes.root}
                rows={data}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 15, 20]}
            />
        </div>
    );
};

export default PeriodActivityStats;