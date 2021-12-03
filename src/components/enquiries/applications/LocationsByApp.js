import React from 'react';
import {DataGrid} from '@mui/x-data-grid'
import {makeStyles} from '@mui/styles';
import {useQuery, gql, useReactiveVar, useLazyQuery} from "@apollo/client";
import {gridSelectionsVar} from "../../../cache";
import {CircularProgress} from "@mui/material";
import {v4 as uuidv4} from 'uuid'
import {formatNumberTwoDecimals} from "../../../functions/commonFunctions";
import ReactModal from 'react-modal';
import {useModal} from "react-modal-hook";
import CreateButton from "../../ui-components/buttons/CreateButton";
import Button from "@mui/material/Button";


const GET_APP_BY_LOCATION = gql`
query GetAppByLocation($applicationId:Int!, $orderId:Int!) {
  applicationDetailSitelocationLevelGrids(
    filter: { applicationId: { equalTo: $applicationId },orderId: {equalTo: $orderId} }
  ) {
    nodes {
      
      
      itemCount
      orderNumber
      projectTitle
      reference
      valueApplied
      worksheetReference
      orderId
	  applicationId
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
	{field: 'orderNumber', headerName: 'Order Number', minWidth: 150, flex: 1, cellClassName: 'grid-bold - font'},
	{field: 'projectTitle', headerName: 'Project Title', minWidth: 80, flex: 1},
	{field: 'worksheetReference', headerName: 'Worksheet Reference', minWidth: 80, flex: 1},
	{field: 'reference', headerName: 'Reference', type: 'number', minWidth: 100, flex: 1},
	{field: 'itemCount', headerName: 'Items', type: 'number', minWidth: 80, flex: 1},

	{
		field: 'valueApplied',
		headerName: 'App Value',
		type: 'number',
		minWidth: 100,
		flex: 1,
		cellClassName: 'grid-bold-font'
	},
]

const LocationsByApp = ({hideModal, params, showModal}) => {
	const classes = useStyles ()
	const [tableData, setTableData] = React.useState ([])
	const selectedApplication = useReactiveVar (gridSelectionsVar).selectedApplication
	const {data, loading} = useQuery (GET_APP_BY_LOCATION, {
		variables: {applicationId: params.row.applicationId, orderId: params.row.orderId},
		notifyOnNetworkStatusChange: true,
		fetchPolicy: 'network-only',
		onCompleted: data => setTableData (data.applicationDetailSitelocationLevelGrids.nodes.map (item => ({
			...item,
			id: uuidv4 (),
			valueApplied: formatNumberTwoDecimals (Number (item.valueApplied))
		})))
	})
	console.log (params.row.orderId, selectedApplication, params.row.applicationId, data && data.applicationDetailSitelocationLevelGrids.nodes)

	if ( loading ) return <CircularProgress/>

	return (
		<div style={{width: '100%', height: '80%'}}>
			<Button onClick={hideModal}>
				CLOSE WINDOW
			</Button>
			<h3 style={{textDecoration: 'underline'}}>APPLICATION LOCATION DETAIL</h3>
			<DataGrid
				className={classes.root}
				rows={tableData}
				/* rows={data.applicationDetailSitelocationLevels.nodes.map(item => ({
					...item,
					id: uuidv4(),
					valueApplied: formatNumberTwoDecimals(Number(item.valueApplied))
				}))} */
				columns={columns}
				pageSize={5}
				rowsPerPageOptions={[5, 10, 15, 20]}
			/>
		</div>
	);
};


const LocationsByAppModal = (params) => {
	//console.log (params.row.orderId, params.row.applicationId)

	const [showModal, hideModal] = useModal (() => {

		return (
			<ReactModal isOpen appElement={document.getElementById ('root')}>
				<LocationsByApp hideModal={hideModal} params={params} showModal={showModal}/>
			</ReactModal>
		)
	});
	return (
		<Button
			variant="contained"
			style={{background: '#22415e', padding: 4}}
			onClick={showModal}
		>
			View Detail
		</Button>
	);
};

export default LocationsByAppModal;