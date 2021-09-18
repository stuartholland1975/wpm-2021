import React from 'react';
import { formatNumberGridTwoDecimals } from '../../functions/commonFunctions';
import { AgGridReact } from 'ag-grid-react';
import { gridSelectionsVar, toggleCompleteVar } from '../../cache';
import { useReactiveVar } from '@apollo/client';

const rowClassRules = {
  'complete-row': (params) => params.data.complete,
};

const columnDefs = [
  { headerName: 'Item No', field: 'itemNumber', sort: 'desc', maxWidth: 120 },
  {
    headerName: 'Item Type',
    field: 'typeShort',
    maxWidth: 120,
  },
  { headerName: 'Worksheet', field: 'worksheetReference' },
  {
    headerName: 'Activity Code',
    field: 'activityCode',
  },
  {
    headerName: 'Activity Description',
    field: 'activityDescription',
  },
  {
    headerName: 'Qty Ordered',
    field: 'qtyOrdered',
    type: 'numericColumn',
    valueFormatter: formatNumberGridTwoDecimals,
  },
  {
    headerName: 'Unit Value',
    field: 'unitPayableTotal',
    valueFormatter: formatNumberGridTwoDecimals,
    type: 'numericColumn',
  },
  {
    headerName: 'Order Value',
    field: 'valuePayableTotal',
    valueFormatter: formatNumberGridTwoDecimals,
    type: 'numericColumn',
  },
  {
    headerName: 'Qty Done',
    field: 'qtyComplete',
    type: 'numericColumn',
    valueFormatter: formatNumberGridTwoDecimals,
  },
  {
    headerName: 'Done Value',
    field: 'valueComplete',
    valueFormatter: formatNumberGridTwoDecimals,
    type: 'numericColumn',
  },
  {
    headerName: 'Qty Applied',
    field: 'qtyApplied',
    type: 'numericColumn',
    valueFormatter: formatNumberGridTwoDecimals,
  },
  {
    headerName: 'Applied Value',
    field: 'valueApplied',
    type: 'rightAligned',
    valueFormatter: formatNumberGridTwoDecimals,
  },
  {
    headerName: 'Complete',
    field: 'complete',
    type: 'rightAligned',
    valueFormatter: function (params) {
      return params.value ? 'Yes' : 'No';
    },
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
    filter: 'agDateColumnFilter',
  },
};

const OrderItemsGrid = ({ data }) => {
 // const toggleComplete = useReactiveVar(toggleCompleteVar);
  const selectedItem = useReactiveVar(gridSelectionsVar).selectedItem;

  const gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: defaultColDef,
    columnTypes: columnTypes,
    pagination: true,
    paginationPageSize: 30,
    domLayout: 'autoHeight',
    rowSelection: 'single',
    onRowSelected: selectedRow,
    isRowSelectable: function (rowNode) {
      return rowNode.data && !rowNode.data.complete;
    },
    rowClassRules: rowClassRules,
    animateRows: true,
    rowData: data,
    onGridReady: (params) => params.api.sizeColumnsToFit(),
    onGridSizeChanged: (params) => params.api.sizeColumnsToFit(),
  };

  function selectedRow(params) {
    const selected = params.api.getSelectedRows();
    if (selected.length > 0) {
      gridSelectionsVar({
        ...gridSelectionsVar(),
        selectedItem: selected[0],
      });
    } else {
      gridSelectionsVar({ ...gridSelectionsVar(), selectedItem: false });
    }
  }

  React.useEffect(() => {
    gridSelectionsVar({ ...gridSelectionsVar(), selectedItem: false });
  }, [selectedItem]);

  return (
    <div className='ag-theme-custom-react' style={{ marginLeft: 5, marginRight: 5 }}>
      <AgGridReact gridOptions={gridOptions} reactUi={true} />
    </div>
  );
};

export default OrderItemsGrid;
