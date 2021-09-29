import React, {useMemo} from 'react';
import {formatDateGrid, formatNumberGridTwoDecimals} from "../../functions/commonFunctions";
import {AgGridReact} from "ag-grid-react";


const cellClassRulesCurrent = {
  "cell-warning": params => params.value === true,
  "cell-pass": params => params.value === false,
}

const cellClassRulesOpen = {
  "cell-pass": params => params.value === true,
}
const PeriodsGrid = (props) => {

  const columnDefs = useMemo(() => [
    {
      headerName: "Period",
      field: 'periodNumber',
      cellStyle: {'text-align': 'left'}
    },
    {
      headerName: 'Week Commencing',
      field: 'weekCommencingDate',
      valueFormatter: formatDateGrid,
      cellStyle: {'text-align': 'left'}
    },
    {
      headerName: 'Week Ending',
      field: 'weekEndingDate',
      valueFormatter: formatDateGrid,
      cellStyle: {'text-align': 'left'}
    },
    {
      headerName: 'Year',
      field: 'year',
      cellStyle: {'text-align': 'left'}
    },
    {
      headerName: 'Week',
      field: 'week',
      cellStyle: {'text-align': 'left'}
    },
    {
      headerName: 'Current',
      field: 'current',
      cellClassRules: cellClassRulesCurrent,
      valueFormatter: function (params) {
        return params.value ? 'Yes' : 'No';
      },
      cellStyle: params => params.value ? {
        color: 'red',
        'text-align': 'left',
        'font-weight': 'bolder'
      } : {'text-align': 'left'}

    },
    {
      headerName: 'Closed',
      field: 'closed',
      cellClassRules: cellClassRulesOpen,
      valueFormatter: function (params) {
        return params.value ? 'Yes' : 'No';
      },
      cellStyle: params => params.value ? {
        color: '#004100',
        'text-align': 'left',
        'font-weight': 'bolder'
      } : {'text-align': 'left'}
    },
    {
      headerName: 'Works Value',
      field: 'worksValue',
      type: 'rightAligned',
      valueFormatter: formatNumberGridTwoDecimals
    }
  ], [])

  const defaultColDef = useMemo(() => ({
    filter: true,
    sortable: true,
    resizable: true,
    flex: true,
  }), [])

  const columnTypes = useMemo(() => ({
    dateColumn: {
      filter: "agDateColumnFilter",
    },
  }), [])

  const gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: defaultColDef,
    columnTypes: columnTypes,
    pagination: true,
    paginationPageSize: 35,
    domLayout: "autoHeight",
    rowSelection: "single",
    animateRows: true,
    //  onRowSelected: selectedRow,
    rowData: props.data,
    onGridSizeChanged: params => params.api.sizeColumnsToFit()
  };

  return (
    <div className="ag-theme-custom-react" style={{margin: 5}}>
      <AgGridReact
        gridOptions={gridOptions}
        reactUi={true}
      />
    </div>
  );
};

export default PeriodsGrid;