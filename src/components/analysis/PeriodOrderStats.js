import { DataGrid } from '@mui/x-data-grid'
import { makeStyles } from '@mui/styles';

const columns = [
    { field: 'orderNumber', headerName: 'Order Number', width: 120 },
    { field: 'projectTitle', headerName: 'Project Title', width: 150 },
    { field: 'locationCount', headerName: 'Locations', type: 'number', width: 100 },
    { field: 'averageLocationValue', headerName: 'Average Location', type: 'number', width: 150 },
    { field: 'itemCount', headerName: 'Items', type: 'number', width: 100 },
    { field: 'averageItemValue', headerName: 'Average Item', type: 'number', width: 120 },
    { field: 'valueComplete', headerName: 'Value Complete', type: 'number', width: 150 },
]

const useStyles = makeStyles({
    root: {
        background: "#c1c1c1",
        borderWidth: 1,
        borderColor: 'black'
    }
})


const PeriodOrderStats = ({ data }) => {

    const classes = useStyles()

    return (
        <div style={{ height: 375, width: '100%' }}>
            <h3 style={{ textDecoration: 'underline' }}>VALUES BY ORDER NUMBER</h3>
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

export default PeriodOrderStats;