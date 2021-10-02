import { useQuery, gql } from '@apollo/client';
import { formatDateGrid } from '../../functions/commonFunctions';
import { CircularProgress } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import GlobalDocumentAdminButtons from '../button-bars/GlobalDocumentAdminButtons';
import { gridSelectionsVar } from '../../cache';

export const columnCentered = {
	headerClass: 'text-center',
	cellStyle: {
		textAlign: 'center',
	},
};

const GET_GLOBAL_DOCUMENTS = gql`
	query GetGlobalDocuments {
		documents(condition: { global: true }) {
			nodes {
				createdAt
				headerDocumentFile
				id
				title
				orderheaderDocuments {
					totalCount
				}
			}
		}
	}
`;

const columnDefs = [
	{
		headerName: 'Doc Id',
		field: 'id',
		...columnCentered,
	},
	{
		headerName: 'Title',
		field: 'title',
		...columnCentered,
	},

	{
		headerName: 'Orders Attached To',
		field: 'orderheaderDocuments.totalCount',
		...columnCentered,
	},

	{
		headerName: 'Date Uploaded',
		field: 'createdAt',
		valueFormatter: formatDateGrid,
		...columnCentered,
	},

	{
		headerName: 'Document Link',
		colId: 'document_link',
		cellRenderer: documentLink,
		...columnCentered,
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

function documentLink(params) {
	let link;
	link = document.createElement('a');
	link.href = `http://workpm.ddns.net/documents/${params.data.headerDocumentFile.id}`;
	link.style = 'font-weight: bold';
	link.innerText = 'Open Document';
	link.target = '_blank';
	link.rel = 'noreferrer';

	return link;
}

function selectedRow(params) {
	const selected = params.api.getSelectedRows();
	if (selected.length > 0) {
		gridSelectionsVar({
			...gridSelectionsVar(),
			selectedDocument: selected[0],
		});
	} else {
		gridSelectionsVar({ ...gridSelectionsVar(), selectedDocument: false });
	}
}

const GlobalDocuments = () => {
	const { data, loading } = useQuery(GET_GLOBAL_DOCUMENTS, {
		fetchPolicy: 'cache-and-network',
	});

	const gridOptions = {
		columnDefs: columnDefs,
		defaultColDef: defaultColDef,
		columnTypes: columnTypes,
		pagination: true,
		paginationPageSize: 25,
		domLayout: 'autoHeight',
		rowSelection: 'single',
		animateRows: true,
		rowData: data && data.documents.nodes,
		onGridReady: (params) => params.api.sizeColumnsToFit(),
		onGridSizeChanged: (params) => params.api.sizeColumnsToFit(),
		onRowSelected: selectedRow,
	};

	if (loading) {
		return <CircularProgress />;
	}

	return (
		<>
			<GlobalDocumentAdminButtons />
			<div style={{ margin: 5 }}>
				<AgGridReact
					gridOptions={gridOptions}
					className='ag-theme-custom-react'
					reactUi={false}
				/>
			</div>
		</>
	);
};

export default GlobalDocuments;
