import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useReactiveVar } from '@apollo/client';
import { gridSelectionsVar, selectedWorksheetsVar } from '../../cache';
import { formatNumberGridTwoDecimals } from '../../functions/commonFunctions';

const columnDefs = [
    {
        headerName: "Worksheet Ref",
        field: "worksheetReference",
        sort: "asc",
        cellStyle: { textAlign: 'left' }
    },
    {
        headerName: "Item Number",
        field: "itemNumber",
        cellStyle: { textAlign: 'left' },
        sort: 'asc',
    },
    {
        headerName: "Activity Code",
        field: "activityCode",
        cellStyle: { textAlign: 'left' }
    },
    {
        headerName: "Activity Description",
        field: "activityDescription",
        cellStyle: { textAlign: 'left' }
    },
    {
        headerName: "Available Qty",
        cellStyle: { fontWeight: "bold" },
        type: "numericColumn",
        valueGetter: params => params.data.qtyComplete - params.data.qtyApplied,
        valueFormatter: formatNumberGridTwoDecimals,
    },
    {
        headerName: "Available Value",
        cellStyle: { fontWeight: "bold" },
        type: "numericColumn",
        valueGetter: params => params.data.valueComplete - params.data.valueApplied,
        valueFormatter: formatNumberGridTwoDecimals,
    },
    {
        headerName: "Worksheet Count",
        type: "numericColumn",
        field: "worksheetCount",
    },

]

const defaultColDef = {
    filter: true,
    sortable: true,
    resizable: true,
    flex: true,
};

const AvailableItemsList = ({ data }) => {

    const selectedLocation = useReactiveVar(gridSelectionsVar).selectedLocation

    const selectedOrder = useReactiveVar(gridSelectionsVar).selectedOrder

    const gridData = data.filter(obj => obj.sitelocationId === selectedLocation && obj.orderheaderId === selectedOrder)

    const gridOptions = {
        columnDefs,
        defaultColDef,
        pagination: true,
        paginationPageSize: 25,
        domLayout: 'autoHeight',
        animateRows: true,
        rowSelection: 'multiple',
        rowMultiSelectWithClick: true,

        onRowSelected: selectedRow,
        overlayNoRowsTemplate:
            '<h3 style="padding: 8px; border: 2px solid #444; background: #e6e6e6">No Location Selected</h3>',
    };


    function selectedRow(params) {
        const selected = params.api.getSelectedNodes();
        if (selected.length > 0) {
            const selectedWorksheetValues = selected.map(item => item.data.valueComplete - item.data.valueApplied).reduce((total, amount) => total + amount)
            gridSelectionsVar({
                ...gridSelectionsVar(),
                selectedItem: selected[0].data.id,
                worksheetsValue: selectedWorksheetValues
            });
            const selectedWorksheetIds = selected.map(item => item.data.worksheetId)

            let dataArray = []
            selectedWorksheetIds.forEach(item => dataArray.push(...item))
            selectedWorksheetsVar(
                dataArray
            );
        } else {
            gridSelectionsVar({ ...gridSelectionsVar(), selectedItem: false });
        }
    }

    const onGridReady = (params) => {
        params.api.sizeColumnsToFit();
        gridSelectionsVar({ ...gridSelectionsVar(), selectedItem: false });
    };
    return (
        <div className='ag-theme-custom-react' style={{ margin: 5 }}>
            <h3 style={{ textDecoration: "underline" }}>ITEMS AVAILABLE FOR APPLICATION</h3>
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

export default AvailableItemsList;