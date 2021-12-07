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
import ItemsByLocationApp from "./ItemsByLocationApp";


const GET_APP_BY_LOCATION = gql`
query GetAppByLocation($applicationId:Int!, $orderId:Int!) {
  applicationSummarySitelocationWithCumulativeValues(
    filter: { applicationId: { equalTo: $applicationId },orderId: {equalTo: $orderId} }
  ) {
    nodes {
      id,
      applicationId
      cumulativeApplicationValue
      itemCount
      orderNumber
      projectTitle
      reference
      thisApplicationValue
      worksheetReference
      prevCumulativeApplicationValue
      orderId
	  imageCount
    }
  }
}
`

const useStyles = makeStyles ({
	root: {
		background: "#e5d8d8",
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
	{field: 'imageCount', headerName: 'Images', type: 'number', minWidth: 80, flex: 1},
	{
		field: 'prevCumulativeApplicationValue',
		headerName: 'Prev Cum App Value',
		type: 'number',
		minWidth: 100,
		flex: 1,

	},
	{
		field: 'thisApplicationValue',
		headerName: 'This App Value',
		type: 'number',
		minWidth: 100,
		flex: 1,
		cellClassName: 'grid-bold-font'
	},
	{
		field: 'cumulativeApplicationValue',
		headerName: 'Cum App Value',
		type: 'number',
		minWidth: 100,
		flex: 1,
		cellClassName: 'grid-bold-font'
	},
	{
		field: '',
		flex: 1,
		align: 'center',
		disableClickEventBubbling: true,
		renderCell: (params) => (
			<Button
				size={'small'}
				variant="contained"
				fullWidth
				style={{background: '#22415e', padding: 5, margin: 5}}
			>
				view detail
			</Button>
		),
	}
]

const LocationsByApp = ({hideModal, params, showModal}) => {
	const classes = useStyles ()
	const [tableData, setTableData] = React.useState ([])
	const [showDetail, setShowDetail] = React.useState (false)
	const [selectedLocation, setSelectedLocation] = React.useState ({})
	const {data, loading} = useQuery (GET_APP_BY_LOCATION, {
		variables: {applicationId: params.row.applicationId, orderId: params.row.orderId},
		notifyOnNetworkStatusChange: true,
		fetchPolicy: 'network-only',
		onCompleted: data => setTableData (data.applicationSummarySitelocationWithCumulativeValues.nodes.map (item => ({
			...item,
			//	id: uuidv4 (),
			thisApplicationValue: formatNumberTwoDecimals (Number (item.thisApplicationValue)),
			cumulativeApplicationValue: formatNumberTwoDecimals (Number (item.cumulativeApplicationValue)),
			prevCumulativeApplicationValue: formatNumberTwoDecimals (Number (item.prevCumulativeApplicationValue))
		})))
	})
	//console.log (params.row.orderId, selectedApplication, params.row.applicationId, data && data.applicationSummarySitelocationWithCumulativeValues.nodes)

	if ( loading ) return <CircularProgress/>

	return (
		<div style={{width: '100%', height: '30%'}}>
			<Button onClick={hideModal}>
				CLOSE WINDOW
			</Button>
			<h3 style={{textDecoration: 'underline'}}>APPLICATION LOCATION DETAIL</h3>
			<DataGrid
				className={classes.root}
				rows={tableData}
				columns={columns}
				pageSize={5}
				density={'compact'}
				autoHeight={true}
				onRowClick={params => {
					setSelectedLocation (params.row)
					setShowDetail (true)
				}}
				disableSelectionOnClick
			/>

			{
				showDetail && <ItemsByLocationApp data={selectedLocation} selections={params.row} s/>
			}

		</div>
	)
		;
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
			size={'small'}
			variant="contained"
			style={{background: '#22415e', padding: 5}}
			onClick={showModal}
		>
			View Locations
		</Button>
	);
};

export default LocationsByAppModal;