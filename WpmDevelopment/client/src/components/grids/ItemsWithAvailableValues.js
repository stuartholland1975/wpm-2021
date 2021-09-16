import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { formatNumberGridTwoDecimals } from '../../functions/commonFunctions';
import { WpmGridContext } from '../../wpmGridContext';

const columnDefs = [
  {
    headerName: 'Item Number',
    field: 'itemNumber',
    headerCheckboxSelection: true,
  },
  {
    headerName: 'Activity Code',
    field: 'activityCode',
  },

  {
    headerName: 'Activity Description',
    field: 'activityDescription',
    minWidth: 300,
  },
  {
    headerName: 'Application Qty',
    type: 'numericColumn',
    valueGetter: (params) => params.data.qtyComplete - params.data.qtyApplied,
    valueFormatter: formatNumberGridTwoDecimals,
  },
  {
    headerName: 'Application Value',
    type: 'numericColumn',
    valueGetter: (params) =>
      params.data.valueComplete - params.data.valueApplied,
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

const ItemsWithAvailableValues = ({ data }) => {
  const { setSelectedItems, selectedLocation, setSelectedWorksheets } =
    React.useContext(WpmGridContext);

  const gridData = selectedLocation
    ? data.filter((obj) => obj.sitelocationId === selectedLocation.id)
    : [];

  const gridOptions = {
    columnDefs,
    defaultColDef,
    columnTypes,
    //  pagination: true,
    //  paginationPageSize: 20,
    domLayout: 'autoHeight',
    animateRows: true,
    rowSelection: 'multiple',
    onRowSelected: selectedRow,
    rowMultiSelectWithClick: true,
  };

  function selectedRow(params) {
    const selected = params.api.getSelectedNodes();
    if (selected.length > 0) {
      let x = [];
      selected
        .map((item) => item.data.orderdetailById.worksheets.nodes)
        .forEach((item) => item.forEach((item) => x.push(item)));
      setSelectedItems(selected.map((item) => item.data));
      setSelectedWorksheets(x);
    } else {
      setSelectedItems(false);
      setSelectedWorksheets(false);
    }
  }

  return (
    <>
      <div className="grid-title">ITEMS AVAILABLE FOR APPLICATION:</div>
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

export default ItemsWithAvailableValues;
