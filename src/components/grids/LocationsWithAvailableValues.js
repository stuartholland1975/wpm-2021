import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { formatNumberGridTwoDecimals } from '../../functions/commonFunctions';
import { WpmGridContext } from '../../wpmGridContext';

const columnDefs = [
  {
    headerName: 'Worksheet Reference',
    field: 'worksheetReference',
  },
  {
    headerName: 'Location Reference',
    field: 'reference',
    minWidth: 300,
  },

  {
    headerName: 'Order Value',
    field: 'orderValue',
    type: 'numericColumn',
    valueFormatter: formatNumberGridTwoDecimals,
  },
  {
    headerName: 'Complete Value',
    field: 'valueComplete',
    type: 'numericColumn',
    valueFormatter: formatNumberGridTwoDecimals,
  },
  {
    headerName: 'Applied Value',
    field: 'valueApplied',
    type: 'numericColumn',
    valueFormatter: formatNumberGridTwoDecimals,
  },
  {
    headerName: 'Available Value',
    type: 'numericColumn',
    valueGetter: (params) =>
      params.data.valueComplete - params.data.valueApplied,

    valueFormatter: formatNumberGridTwoDecimals,
  },
  {
    headerName: 'Available Items',
    field: 'availableItems',
    type: 'numericColumn',
  },
  {
    headerName: 'Images',
    field: 'imageCount',
    type: 'numericColumn',
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
const LocationsWithAvailableValues = ({ data }) => {
  const {
    setSelectedLocation,
    selectedOrder,
    setSelectedWorksheets,
    setSelectedItems,
  } = React.useContext(WpmGridContext);

  const gridData = selectedOrder
    ? data.filter((obj) => obj.orderheaderId === selectedOrder.id)
    : [];

  const gridOptions = {
    columnDefs,
    defaultColDef,
    columnTypes,
    pagination: true,
    paginationPageSize: 20,
    domLayout: 'autoHeight',
    animateRows: true,
    rowSelection: 'single',
    onRowSelected: selectedRow,
  };

  function selectedRow(params) {
    const selected = params.api.getSelectedNodes();
    if (selected.length > 0) {
      setSelectedLocation(selected[0].data);
      setSelectedItems(false);
      setSelectedWorksheets(false);
    } else {
      setSelectedLocation(false);
      setSelectedItems(false);
      setSelectedWorksheets(false);
    }
  }

  return (
    <>
      <div className="grid-title">LOCATIONS AVAILABLE FOR APPLICATION:</div>
      <div className="ag-theme-custom-react" style={{ width: '100%' }}>
        <AgGridReact
          gridOptions={gridOptions}
          rowData={gridData}
          onGridReady={(params) => params.api.sizeColumnsToFit()}
          onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
        />
      </div>
    </>
  );
};

export default LocationsWithAvailableValues;
