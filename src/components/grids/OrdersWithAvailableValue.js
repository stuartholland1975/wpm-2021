import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import {formatNumberGridTwoDecimals} from '../../functions/commonFunctions';
import {WpmGridContext} from '../../wpmGridContext';

const columnDefs = [
  {
    headerName: 'Order Number',
    field: 'orderNumber',
  },
  {
    headerName: 'Project Title',
    field: 'projectTitle',
    minWidth: 250,
  },
  {
    headerName: 'Area',
    field: 'area',
    maxWidth: 100,
  },
  {
    headerName: 'Order Value',
    field: 'orderValueTotal',
    type: 'numericColumn',
    valueFormatter: formatNumberGridTwoDecimals,
  },
  {
    headerName: 'Complete Value',
    field: 'orderValueTotalComplete',
    type: 'numericColumn',
    valueFormatter: formatNumberGridTwoDecimals,
  },
  {
    headerName: 'Applied Value',
    field: 'orderValueTotalApplied',
    type: 'numericColumn',
    valueFormatter: formatNumberGridTwoDecimals,
  },
  {
    headerName: 'Available Value',
    type: 'numericColumn',
    valueGetter: (params) =>
      params.data.orderValueTotalComplete - params.data.orderValueTotalApplied,

    valueFormatter: formatNumberGridTwoDecimals,
  },
  {
    headerName: 'Available Locations',
    type: 'numericColumn',
    field: 'availableLocations',
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

const OrdersWithAvailableValue = ({ data }) => {
  const {
    setSelectedLocation,
    setSelectedItems,
    setSelectedOrder,
    setSelectedWorksheets,
  } = React.useContext(WpmGridContext);
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
      setSelectedOrder(selected[0].data);
      setSelectedLocation(false);
      setSelectedItems(false);
      setSelectedWorksheets(false);
    } else {
      setSelectedOrder(false);
      setSelectedLocation(false);
      setSelectedItems(false);
      setSelectedWorksheets(false);
    }
  }
  
  React.useEffect(() => setSelectedOrder(false),[setSelectedOrder])

  return (
    <>
      <div className="grid-title">ORDERS AVAILABLE FOR APPLICATION:</div>
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

export default OrdersWithAvailableValue;
