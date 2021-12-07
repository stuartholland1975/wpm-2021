import React from 'react';
import {gql, useQuery} from '@apollo/client'
import {Box, CircularProgress,} from '@mui/material'
import {DataGrid} from "@mui/x-data-grid";
import {makeStyles} from "@mui/styles";
import {formatNumberTwoDecimals} from "../../../functions/commonFunctions";

const GET_APP_LOCATION_ITEMS = gql`
query GetAppLocationItems($applicationId:Int!, $orderId:Int!, $locationId:Int!) {
  applicationSummaryOrderdetailWithCumulativeValues(
    filter: {applicationId: {equalTo: $applicationId}, locationId: {equalTo: $locationId}, orderId: {equalTo: $orderId}}
  ) {
    nodes {
      activityCode
      activityDescription
      prevCumulativeApplicationValue
      cumulativeApplicationValue
      id
      itemNumber
      orderId
      qtyApplied
      thisApplicationValue
    }
  }
}
`

const useStyles = makeStyles ({
	root: {
		background: "#e7dcdc",
		borderWidth: 1,
		borderColor: 'black'
	}
})

const columns = [
	{field: 'itemNumber', headerName: 'Item Number', flex: 1},
	{field: 'qtyApplied', headerName: 'Qty Applied', type: 'number', flex: 1},
	{field: 'activityCode', headerName: 'Activity Code', flex: 1},
	{field: 'activityDescription', headerName: 'Activity Description', flex: 1},
	{field: 'prevCumulativeApplicationValue', headerName: 'Prev Cum App Value', type: 'number', flex: 1},
	{field: 'thisApplicationValue', headerName: 'This App Value', type: 'number', flex: 1},
	{field: 'cumulativeApplicationValue', headerName: 'Cum App Value', type: 'number', flex: 1},
]

const ItemsByLocationApp = ({selections, data}) => {
	const classes = useStyles ()
	const [tableData, setTableData] = React.useState ([])
	const {loading} = useQuery (GET_APP_LOCATION_ITEMS, {
		variables: {applicationId: selections.applicationId, orderId: selections.orderId, locationId: data.id},
		fetchPolicy: 'network-only',
		onCompleted: data => setTableData (data.applicationSummaryOrderdetailWithCumulativeValues.nodes.map (item => ({
			...item,
			thisApplicationValue: formatNumberTwoDecimals (item.thisApplicationValue),
			cumulativeApplicationValue: formatNumberTwoDecimals (item.cumulativeApplicationValue),
			prevCumulativeApplicationValue: formatNumberTwoDecimals (item.prevCumulativeApplicationValue)
		})))
	})
	console.log (selections)
	if ( loading ) return <CircularProgress/>
	return (
		<Box m={5}>
			<DataGrid
				className={classes.root}
				rows={tableData}
				columns={columns}
				pageSize={15}
				density={'compact'}
				autoHeight={true}
				disableSelectionOnClick
			/>
		</Box>

	)
}
export default ItemsByLocationApp;