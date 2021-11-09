import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { formatDateGrid, formatNumberGridTwoDecimals, } from '../../functions/commonFunctions';
import { useReactiveVar } from "@apollo/client";
import { gridSelectionsVar } from "../../cache";

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
  //const { setSelectedApplication } = React.useContext(WpmGridContext);
  const selectedApplication = useReactiveVar(gridSelectionsVar).selectedApplication
  console.log(selectedApplication)
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
      gridSelectionsVar({
        ...gridSelectionsVar(),
        selectedApplication: selected[0].data.id,
      });
    }
    else {
      gridSelectionsVar({ ...gridSelectionsVar(), selectedApplication: false });
    }
  }

  return (
    <>

      <div className='ag-theme-custom-react' style={{ margin: 5 }}>
        <AgGridReact
          gridOptions={gridOptions}
          rowData={data}
          onGridReady={(params) => params.api.sizeColumnsToFit()}
          onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
          reactUi={true}
        />
      </div>
    </>
  );
};

export default ApplicationsGrid;
