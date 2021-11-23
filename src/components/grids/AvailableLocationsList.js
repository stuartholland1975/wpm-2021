import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { gridSelectionsVar } from '../../cache';
import { formatNumberGridTwoDecimals } from '../../functions/commonFunctions';
import { useReactiveVar } from '@apollo/client';


const columnDefs = [
    {
        headerName: "Worksheet Ref",
        field: "worksheetReference",
        sort: "asc",
        cellStyle: { textAlign: 'left' }
    },
    {
        headerName: "Location",
        field: "reference",
        cellStyle: { textAlign: 'left' }
    },
    {
        headerName: "Available Value",
        cellStyle: { fontWeight: "bold" },
        type: "numericColumn",
        valueGetter: params => params.data.valueComplete - params.data.valueApplied,
        valueFormatter: formatNumberGridTwoDecimals,
    },
    {
        headerName: "Item Count",
        type: "numericColumn",
        field: "itemCount",
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


const AvailableLocationsList = ({ data }) => {

    const selectedOrder = useReactiveVar(gridSelectionsVar).selectedOrder

    const gridData = data.filter(obj => obj.orderheaderId === selectedOrder.id)

    const gridOptions = {
        columnDefs,
        defaultColDef,
        pagination: true,
        paginationPageSize: 25,
        domLayout: 'autoHeight',
        animateRows: true,
        rowSelection: 'single',
        onRowSelected: selectedRow,
        overlayNoRowsTemplate:
            '<h3 style="padding: 8px; border: 2px solid #444; background: #e6e6e6">Please Select An Order From The Above Table</h3>',
    };

    function selectedRow(params) {
        const selected = params.api.getSelectedNodes();
        if (selected.length > 0) {
            gridSelectionsVar({
                ...gridSelectionsVar(),
                selectedLocation: selected[0].data.id,
            });
        } else {
            gridSelectionsVar({ ...gridSelectionsVar(), selectedLocation: false, selectedItem: false });
        }
    }

    const onGridReady = (params) => {
        params.api.sizeColumnsToFit();
        gridSelectionsVar({ ...gridSelectionsVar(), selectedLocation: false });
    };
    return (
        <div className='ag-theme-custom-react' style={{ margin: 5 }}>
            <h3 style={{ textDecoration: "underline" }}>LOCATIONS AVAILABLE FOR APPLICATION</h3>
            <AgGridReact
                gridOptions={gridOptions}
                rowData={gridData}
                onGridReady={onGridReady}
                reactUi={true}
                onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
            />
        </div>
    );
};

export default AvailableLocationsList;