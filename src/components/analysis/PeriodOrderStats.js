import {DataGrid} from '@mui/x-data-grid'
import {makeStyles} from '@mui/styles';

const columns = [
	{field: 'orderNumber', headerName: 'Order Number', flex: 1},
	{field: 'projectTitle', headerName: 'Project Title', flex: 1},
	{field: 'locationCount', headerName: 'Locations', type: 'number', flex: 1},
	{field: 'averageLocationValue', headerName: 'Average Location', type: 'number', flex: 1},
	{field: 'itemCount', headerName: 'Items', type: 'number', flex: 1},
	{field: 'averageItemValue', headerName: 'Average Item', type: 'number', flex: 1},
	{field: 'valueComplete', headerName: 'Value Complete', type: 'number', flex: 1},
]

const useStyles = makeStyles ({
	root: {
		background: "#c1c1c1",
		borderWidth: 1,
		borderColor: 'black'
	}
})

const PeriodOrderStats = ({data}) => {

	const classes = useStyles ()

	return (
		<div style={{height: 375, width: '100%'}}>
			<h3 style={{textDecoration: 'underline'}}>VALUES BY ORDER NUMBER</h3>
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