import React from "react";
import { AgGridReact } from "ag-grid-react";
import {
  formatDateGrid,
  formatNumberGridTwoDecimals,
} from "../../functions/commonFunctions";

const columnDefs = [
  {
    headerName: "Worksheet Ref",
    field: "worksheetReference",
  },
  { headerName: "Batch Ref", field: "batchId" },
  {
    headerName: "Location",
    field: "locationReference",
    minWidth: 250,
  },
  {
    headerName: "Item Number",
    field: "itemNumber",
    type: "numericColumn",
    sort: "asc",
  },
  {
    headerName: "Activity Code",
    field: "activityCode",
  },
  {
    headerName: "Activity Description",
    field: "activityDescription",
  },
  {
    headerName: "Work Done Date",
    field: "dateComplete",
    type: "dateColumn",
    valueFormatter: formatDateGrid,
  },
  {
    headerName: "Year",
    field: "year",
  },
  {
    headerName: "Week Number",
    field: "week",
  },
  {
    headerName: "Supervisor Name",
    field: "supervisorName",
  },
  {
    headerName: "Qty Complete",
    field: "qtyComplete",
    type: "numericColumn",
    valueFormatter: formatNumberGridTwoDecimals,
  },
  {
    headerName: "Value Complete",
    field: "valueComplete",
    type: "numericColumn",
    valueFormatter: formatNumberGridTwoDecimals,
  },
  {
    headerName: "Applied",
    field: "applied",
    type: "rightAligned",
    valueFormatter: function (params) {
      return params.value ? "Yes" : "No";
    },
  },
  {
    headerName: "Reporting Period",
    field: "periodNumber",
    type: "numericColumn",
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
    filter: "agDateColumnFilter",
  },
};
const OrderWorksheetsGrid = ({ data, setApi }) => {
  const gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: defaultColDef,
    columnTypes: columnTypes,
    pagination: true,
    paginationPageSize: 25,
    domLayout: "autoHeight",
    rowSelection: "single",
    //  onRowSelected: selectedRow,
    animateRows: true,
  };
  return (
    <>
      <div className="grid-title">ORDER WORKSHEETS LISTING:</div>
      <div className="ag-theme-custom-react" style={{ width: "100%" }}>
        <AgGridReact
          gridOptions={gridOptions}
          rowData={data}
          onGridReady={params => setApi(params.api)}
          onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
        />
      </div>
    </>
  );
};

export default OrderWorksheetsGrid;
