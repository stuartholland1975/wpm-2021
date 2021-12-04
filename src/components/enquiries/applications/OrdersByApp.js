import React from 'react';
import {DataGrid} from '@mui/x-data-grid'
import {makeStyles} from '@mui/styles';
import {useQuery, gql, useReactiveVar} from "@apollo/client";
import {gridSelectionsVar} from "../../../cache";
import {CircularProgress} from "@mui/material";
import {v4 as uuidv4} from 'uuid'
import {formatNumberTwoDecimals} from "../../../functions/commonFunctions";
import LocationsByAppModal from "./LocationsByApp";
import Button from "@mui/material/Button";
import {toggleModal} from "../../../cache";


const useStyles = makeStyles ({
	root: {
		background: "#b6aaaa",
		borderWidth: 1,
		borderColor: 'black'
	}
})

const GET_APP_BY_ORDER = gql`
query GetAppByOrder($applicationId: Int!) {
  applicationDetailOrderheaderLevels(
    filter: { applicationId: { equalTo: $applicationId } }
    orderBy: AREA_ID_ASC
  ) {
    nodes {
      areaDescription
      imageCount
      itemCount
      locationCount
      orderNumber
      projectTitle
      valueApplied
      applicationId
      orderId
	  id
    }
  }
}
`
const columns = [
	{field: 'areaDescription', headerName: 'Area Description', minWidth: 150, flex: 1},
	{field: 'orderNumber', headerName: 'Order Number', minWidth: 80, flex: 1},
	{field: 'projectTitle', headerName: 'Project Title', minWidth: 100, flex: 1},
	{field: 'locationCount', headerName: 'Locations', type: 'number', minWidth: 100, flex: 1},
	{field: 'itemCount', headerName: 'Items', type: 'number', minWidth: 80, flex: 1},
	{field: 'imageCount', headerName: 'Images', type: 'number', minWidth: 80, flex: 1},
	{
		field: 'valueApplied',
		headerName: 'App Value',
		type: 'number',
		minWidth: 100,
		flex: 1,
		cellClassName: 'grid-bold-font'
	},
	{
		field: '', renderCell: LocationsByAppModal,
		flex: 2,
		align: 'center',
		disableClickEventBubbling: true,
	}
]

const OrdersByApp = () => {

	const classes = useStyles ()
	const [tableData, setTableData] = React.useState ([])
	const selectedApplication = useReactiveVar (gridSelectionsVar).selectedApplication
	const {loading, data} = useQuery (GET_APP_BY_ORDER, {
		variables: {applicationId: selectedApplication},
		onCompleted: data => setTableData (data.applicationDetailOrderheaderLevels.nodes.map (item => ({
			...item,
			id: uuidv4 (),
			valueApplied: formatNumberTwoDecimals (item.valueApplied)
		})))
	})

	if ( loading ) return <CircularProgress/>
	return (
		<div style={{height: 375, width: '100%'}}>
			<h3 style={{textDecoration: 'underline'}}>APPLICATION SUMMARY BY ORDER NUMBER</h3>
			<DataGrid
				className={classes.root}
				rows={data.applicationDetailOrderheaderLevels.nodes.map (item => ({
					...item,
					valueApplied: formatNumberTwoDecimals (item.valueApplied)
				}))}
				columns={columns}
				pageSize={5}
				rowsPerPageOptions={[5, 10, 15, 20]}
				disableSelectionOnClick
			/>
		</div>
	);
};

export default OrdersByApp;