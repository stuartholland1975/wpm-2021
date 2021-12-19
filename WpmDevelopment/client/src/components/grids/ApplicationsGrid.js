import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import {formatDateGrid, formatNumberGridTwoDecimals,} from '../../functions/commonFunctions';
import {WpmGridContext} from '../../wpmGridContext';

const cellClassRulesSubmiited = {
  "cell-pass": params => params.value === true,
  "cell-warning": params => params.value === false
};

const cellClassRulesOpen = {
  "cell-pass": params => params.value === true,
}

const columnDefs = [
  {
    headerName: 'Application Number',
    field: 'applicationNumber',
  },
  {
    headerName: 'Application Reference',
    field: 'applicationReference',
  },
  {
    headerName: 'Application Ending Date',
    field: 'applicationDate',
    type: 'dateColumn',
    valueFormatter: formatDateGrid,
  },
  {
    headerName: 'Current',
    field: 'applicationCurrent',
    type: 'rightAligned',
    cellClassRules: cellClassRulesOpen,
    valueFormatter: function (params) {
      return params.value ? 'Yes' : 'No';
    },
  },
  {
    headerName: 'Open',
    field: 'applicationOpen',
    type: 'rightAligned',
    cellClassRules: cellClassRulesOpen,
    valueFormatter: function (params) {
      return params.value ? 'Yes' : 'No';
    },
  },
  {
    headerName: 'Submitted',
    field: 'applicationSubmitted',
    type: 'rightAligned',
    cellClassRules: cellClassRulesSubmiited,
    valueFormatter: function (params) {
      return params.value ? 'Yes' : 'No';
    },
  },
  {
    headerName: 'Orders',
    field: 'orderCount',
    type: 'rightAligned',
  },
  {
    headerName: 'Locations',
    field: 'locationCount',
    type: 'rightAligned',
  },
  {
    headerName: 'Items',
    field: 'itemCount',
    type: 'rightAligned',
  },
  {
    headerName: 'Images',
    field: 'imageCount',
    type: 'rightAligned',
  },
  {
    headerName: 'Application Value',
    field: 'applicationValue',
    type: 'numericColumn',
    valueFormatter: formatNumberGridTwoDecimals,
  },
];

const defaultColDef = {
  filter: true,
  sortable: true,
  resizable: true,
};

const columnTypes = {
  dateColumn: {
    filter: 'agDateColumnFilter',
  },
};

const ApplicationsGrid = ({ data }) => {
  const { setSelectedApplication } = React.useContext(WpmGridContext);
  const gridOptions = {
    columnDefs,
    defaultColDef,
    columnTypes,
    pagination: true,
    paginationPageSize: 35,
    domLayout: 'autoHeight',
    animateRows: true,
    rowSelection: 'single',
    onRowSelected: selectedRow,
  };

  function selectedRow(params) {
    const selected = params.api.getSelectedNodes();
    if (selected.length > 0) {
      setSelectedApplication(selected[0].data);
    } else {
      setSelectedApplication(false);
    }
  }

  return (
    <>
      <div className="grid-title">APPLICATIONS LISTING:</div>
      <div className="ag-theme-custom-react" style={{ width: '100%' }}>
        <AgGridReact
          gridOptions={gridOptions}
          rowData={data}
          onGridReady={(params) => params.api.sizeColumnsToFit()}
          onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
        />
      </div>
    </>
  );
};

export default ApplicationsGrid;