import React from 'react';
import { gridSelectionsVar } from '../../cache';
import { formatNumberGridTwoDecimals } from '../../functions/commonFunctions';
import { AgGridReact } from 'ag-grid-react';

const columnDefs = [
    {
        headerName: "Order Number",
        field: "orderNumber",
        editable: true,
        sort: "asc",
        cellStyle: { textAlign: 'left' }
    },
    {
        headerName: "Project Title",
        field: "projectTitle",
        minWidth: 400,
        editable: true,
        cellStyle: { textAlign: 'left' }
    },
    {
        headerName: "Area",
        field: "area",
        editable: true,
        maxWidth: 100,
        cellStyle: { textAlign: 'left' }
    },
    {
        headerName: "Available Value",
        cellStyle: { fontWeight: "bold" },
        type: "numericColumn",
        valueGetter: params => params.data.orderValueTotalComplete - params.data.orderValueTotalApplied,
        valueFormatter: formatNumberGridTwoDecimals,
    },
    {
        headerName: "Location Count",
        type: "numericColumn",
        field: "locationCount",
    },
    {
        headerName: "Image Count",
        type: "numericColumn",
        field: "imageCount",
    },
]

const defaultColDef = {
    filter: true,
    sortable: true,
    resizable: true,
    flex: true,
};




const AvailableOrdersList = ({ data }) => {

    const gridOptions = {
        columnDefs,
        defaultColDef,
        pagination: true,
        paginationPageSize: 10,
        domLayout: 'autoHeight',
        animateRows: true,
        rowSelection: 'single',
        onRowSelected: selectedRow,
    };

    function selectedRow(params) {
        const selected = params.api.getSelectedNodes();
        if (selected.length > 0) {
            gridSelectionsVar({
                ...gridSelectionsVar(),
                selectedOrder: selected[0].data.id,
                selectedItem: false,
                selectedLocation: false
            });
        } else {
            gridSelectionsVar({ ...gridSelectionsVar(), selectedOrder: false, selectedLocation: false, selectedItem: false });
        }
    }

    const onGridReady = (params) => {
        params.api.sizeColumnsToFit();
        gridSelectionsVar({
            ...gridSelectionsVar(),
            selectedOrder: false
        })
    };


    return (
        <div className='ag-theme-custom-react' style={{ margin: 5 }}>
            <h3 style={{ textDecoration: "underline" }}>ORDERS AVAILABLE FOR APPLICATION</h3>
            <AgGridReact
                gridOptions={gridOptions}
                rowData={data}
                onGridReady={onGridReady}
                reactUi={true}
                onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
            />
        </div>
    );
};



export default AvailableOrdersList;