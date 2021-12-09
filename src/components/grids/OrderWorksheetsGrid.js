/** @format */

import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import {
	formatDateGrid,
	formatNumberGridTwoDecimals,
} from '../../functions/commonFunctions';
import {gql, useQuery, useReactiveVar} from '@apollo/client';
import {gridSelectionsVar} from '../../cache';
import {CircularProgress} from '@mui/material';

const GET_ORDER_WORKSHEETS = gql`
	query GetOrderWorksheets($id: Int!) {
		worksheetWithValues(filter: { orderheaderId: { equalTo: $id } }) {
			nodes {
				activityCode
				activityDescription
				applied
				dateComplete
				id
				itemNumber
				locationReference
				worksheetReference
				week
				year
				periodNumber
				qtyComplete
				supervisorName
				valueComplete
				batchId
				applicationNumber
			}
		}
	}
`;

const columnDefs = [
	{
		headerName: 'Worksheet Ref',
		field: 'worksheetReference',
		cellStyle: {'text-align': 'left'},
	},
	{
		headerName: 'Batch Ref',
		field: 'batchId',
		cellStyle: {'text-align': 'left'},
	},
	{
		headerName: 'Location',
		field: 'locationReference',
		cellStyle: {'text-align': 'left'},
		//minWidth: 250,
	},
	{
		headerName: 'Item Number',
		field: 'itemNumber',
		cellStyle: {'text-align': 'left'},
		sort: 'asc',
	},
	{
		headerName: 'Activity Code',
		field: 'activityCode',
		cellStyle: {'text-align': 'left'},
	},
	{
		headerName: 'Activity Description',
		field: 'activityDescription',
		cellStyle: {'text-align': 'left'},
	},
	{
		headerName: 'Work Done Date',
		field: 'dateComplete',
		type: 'dateColumn',
		valueFormatter: formatDateGrid,
		cellStyle: {'text-align': 'left'},
	},
	{
		headerName: 'Year',
		field: 'year',
		cellStyle: {'text-align': 'left'},
	},
	{
		headerName: 'Week Number',
		field: 'week',
		cellStyle: {'text-align': 'left'},
	},
	{
		headerName: 'Supervisor Name',
		field: 'supervisorName',
		cellStyle: {'text-align': 'left'},
	},
	{
		headerName: 'Qty Complete',
		field: 'qtyComplete',
		type: 'numericColumn',
		valueFormatter: formatNumberGridTwoDecimals,
	},
	{
		headerName: 'Value Complete',
		field: 'valueComplete',
		type: 'numericColumn',
		valueFormatter: formatNumberGridTwoDecimals,
	},
	{
		headerName: 'Applied',
		field: 'applied',
		type: 'rightAligned',
		valueFormatter: function (params) {
			return params.value ? 'Yes' : 'No';
		},
	},
	{
		headerName: 'App Number',
		field: 'applicationNumber',
		type: 'numericColumn',
	},
	{
		headerName: 'Reporting Period',
		field: 'periodNumber',
		type: 'numericColumn',
	},
];

const defaultColDef = {
	filter: true,
	sortable: true,
	resizable: true,
	flex: true,
};

const columnTypes = {
	dateColumn: {
		filter: 'agDateColumnFilter',
	},
};
const OrderWorksheetsGrid = () => {
	const selectedOrder = useReactiveVar (gridSelectionsVar).selectedOrder;
	const {loading, data} = useQuery (GET_ORDER_WORKSHEETS, {
		variables: {id: selectedOrder.id},
	});

	const gridOptions = {
		columnDefs: columnDefs,
		defaultColDef: defaultColDef,
		columnTypes: columnTypes,
		pagination: true,
		paginationPageSize: 30,
		domLayout: 'autoHeight',
		rowSelection: 'single',
		animateRows: true,
		rowData: data?.worksheetWithValues.nodes,
		onGridReady: (params) => {
			params.api.sizeColumnsToFit ();
		},
		onGridSizeChanged: (params) => params.api.sizeColumnsToFit (),
	};
	if ( loading ) {
		return <CircularProgress/>;
	}

	return (
		<div style={{marginLeft: 5, marginRight: 5, marginTop: 25}}>
			<AgGridReact
				gridOptions={gridOptions}
				reactUi={false}
				className='ag-theme-custom-react'
			/>
		</div>
	);
};

export default OrderWorksheetsGrid;
