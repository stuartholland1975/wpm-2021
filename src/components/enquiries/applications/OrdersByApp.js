/** @format */

import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles';
import { useQuery, gql, useReactiveVar } from '@apollo/client';
import { gridSelectionsVar } from '../../../cache';
import { CircularProgress } from '@mui/material';
import { formatNumberTwoDecimals } from '../../../functions/commonFunctions';
import LocationsByAppModal from './LocationsByApp';
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles({
	root: {
		background: '#b6aaaa',
		borderWidth: 1,
		borderColor: 'black',
	},
});

const GET_APP_BY_ORDER = gql`
	query GetAppByOrder($applicationId: Int!) {
		applicationSummaryOrderheaderWithCumulativeValues(
			filter: { applicationId: { equalTo: $applicationId } }
			orderBy: AREA_ID_ASC
		) {
			nodes {
				areaDescription
				itemCount
				locationCount
				orderNumber
				projectTitle
				thisApplicationValue
				applicationId
				orderId
				cumulativeApplicationValue
				prevCumulativeApplicationValue
				orderValue
			}
		}
	}
`;

const columns = [
	{
		field: 'areaDescription',
		headerName: 'Area Description',
		minWidth: 150,
		flex: 1,
	},
	{ field: 'orderNumber', headerName: 'Order Number', minWidth: 80, flex: 1 },
	{
		field: 'projectTitle',
		headerName: 'Project Title',
		minWidth: 100,
		flex: 1,
	},
	{
		field: 'locationCount',
		headerName: 'Locations',
		type: 'number',
		minWidth: 100,
		flex: 1,
	},
	{
		field: 'itemCount',
		headerName: 'Items',
		type: 'number',
		minWidth: 80,
		flex: 1,
	},
	{
		field: 'prevCumulativeApplicationValue',
		headerName: 'Prev Cum App Value',
		type: 'number',
		minWidth: 100,
		flex: 1,
		cellClassName: 'grid-bold-font',
	},
	{
		field: 'thisApplicationValue',
		headerName: 'This App Value',
		type: 'number',
		minWidth: 100,
		flex: 1,
		cellClassName: 'grid-bold-font',
	},
	{
		field: 'cumulativeApplicationValue',
		headerName: 'Cum App Value',
		type: 'number',
		minWidth: 100,
		flex: 1,
		cellClassName: 'grid-bold-font',
	},
	{
		field: 'orderValue',
		headerName: 'Order Value',
		type: 'number',
		minWidth: 100,
		flex: 1,
		cellClassName: 'grid-bold-font',
	},
	{
		field: '',
		renderCell: LocationsByAppModal,
		flex: 2,
		align: 'center',
		disableClickEventBubbling: true,
	},
];

const OrdersByApp = ({ orderData }) => {
	const classes = useStyles();
	const selectedApplication =
		useReactiveVar(gridSelectionsVar).selectedApplication;
	const [tableData, setTableData] = React.useState([]);
	const { loading } = useQuery(GET_APP_BY_ORDER, {
		variables: { applicationId: selectedApplication.id },
		fetchPolicy: 'network-only',
		onCompleted: (data) =>
			setTableData(() =>
				orderData
					? orderData.map((item) => ({
						...item,
						id: uuidv4(),
						valueApplied: formatNumberTwoDecimals(item.valueApplied),
					}))
					: data.applicationSummaryOrderheaderWithCumulativeValues.nodes.map(
						(item) => ({
							...item,
							id: uuidv4(),
							valueApplied: formatNumberTwoDecimals(item.valueApplied),
						}),
					),
			),
	});


	if (loading) return <CircularProgress />;

	return (
		<div style={{ height: 600, width: '100%', marginTop: 50 }}>
			<h3 style={{ textDecoration: 'underline' }}>
				APPLICATION SUMMARY BY ORDER NUMBER
			</h3>
			<DataGrid
				className={classes.root}
				rows={
					tableData.length > 0 &&
					tableData.map((item) => ({
						...item,
						thisApplicationValue: formatNumberTwoDecimals(
							item.thisApplicationValue,
						),
						cumulativeApplicationValue: formatNumberTwoDecimals(
							item.cumulativeApplicationValue,
						),
						prevCumulativeApplicationValue: formatNumberTwoDecimals(
							item.prevCumulativeApplicationValue,
						),
						orderValue: formatNumberTwoDecimals(item.orderValue),
						id: uuidv4(),
					}))
				}
				columns={columns}
				pageSize={10}
				rowsPerPageOptions={[10]}
			/>
		</div>
	);
};

export default OrdersByApp;
