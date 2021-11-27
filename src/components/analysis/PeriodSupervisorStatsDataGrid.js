import { DataGrid } from '@mui/x-data-grid'
import { makeStyles } from '@mui/styles';


const columns = [
    { field: 'supervisorName', headerName: 'Supervisor', width: 120 },
    { field: 'orderCount', headerName: 'Orders', width: 80, type: 'number' },
    { field: 'averageOrderValue', headerName: 'Average Order', type: 'number', width: 120 },
    { field: 'locationCount', headerName: 'Locations', type: 'number', width: 100 },
    { field: 'averageLocationValue', headerName: 'Average Location', type: 'number', width: 120 },
    { field: 'itemCount', headerName: 'Items', type: 'number', width: 100 },
    { field: 'averageItemValue', headerName: 'Average Item', type: 'number', width: 120 },
    { field: 'valueComplete', headerName: 'Value Complete', type: 'number', width: 120 },
]

const useStyles = makeStyles({
    root: {
        background: "#d9d9d9",
        borderWidth: 1,
        borderColor: 'black'
    }
})

const PeriodSupervisorStats = ({ data }) => {
    const classes = useStyles()
    return (
        <div style={{ height: 375, width: '100%' }}>
            <h3 style={{ textDecoration: 'underline' }}>VALUES BY SUPERVISOR</h3>
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

export default PeriodSupervisorStats;