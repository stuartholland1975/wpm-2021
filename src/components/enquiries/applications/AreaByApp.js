import React from 'react';
import {DataGrid} from '@mui/x-data-grid'
import {makeStyles} from '@mui/styles';
import {useQuery, gql, useReactiveVar} from "@apollo/client";
import {gridSelectionsVar} from "../../../cache";
import {CircularProgress} from "@mui/material";
import {v4 as uuidv4} from 'uuid'
import {formatNumberTwoDecimals} from "../../../functions/commonFunctions";

const GET_APP_BY_AREA = gql`
query GetAppByArea($applicationId: Int!) {
  applicationDetailAreaLevels(filter: {applicationId: {equalTo: $applicationId}}) {
    nodes {
      applicationNumber
      areaDescription
      areaId
      imageCount
      itemCount
      locationCount
      orderCount
      valueApplied
    }
  }
}
`

const useStyles = makeStyles ({
	root: {
		background: "#c1c1c1",
		borderWidth: 1,
		borderColor: 'black'
	}
})
const columns = [
	{field: 'areaDescription', headerName: 'Area Description', minWidth: 150, flex: 1, cellClassName: 'grid-bold-font'},
	{field: 'orderCount', headerName: 'Orders', type: 'number', minWidth: 80, flex: 1},
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
]

const AreaByApp = () => {
	const classes = useStyles ()
	const [tableData, setTableData] = React.useState ([])
	const selectedApplication = useReactiveVar (gridSelectionsVar).selectedApplication
	const {loading} = useQuery (GET_APP_BY_AREA, {
		variables: {applicationId: selectedApplication},
		fetchPolicy: 'network-only',
		onCompleted: data => setTableData (data.applicationDetailAreaLevels.nodes.map (item => ({
			...item,
			id: uuidv4 (),
			valueApplied: formatNumberTwoDecimals (item.valueApplied)
		})))
	})

	if ( loading ) return <CircularProgress/>

	return (
		<div style={{height: 600, width: '100%', marginTop: 50}}>
			<h3 style={{textDecoration: 'underline'}}>APPLICATION SUMMARY BY AREA</h3>
			<DataGrid
				className={classes.root}
				rows={tableData}
				columns={columns}
				pageSize={10}
				rowsPerPageOptions={[5, 10, 15, 20]}
				onRowClick={params => console.log (params, params.row)}
			/>
		</div>
	);
};

export default AreaByApp;