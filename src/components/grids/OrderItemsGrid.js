import React from 'react';
import { formatNumberGridTwoDecimals } from '../../functions/commonFunctions';
import { AgGridReact } from 'ag-grid-react';
import { gridSelectionsVar } from '../../cache';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

const rowClassRules = {
  'complete-row': (params) => params.data.complete,
};

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

  const [value, setValue] = React.useState(false);
  const [gridApi, setGridApi] = React.useState(null);
  const columnDefs = React.useMemo(() =>
    [
      { headerName: 'Item No', field: 'itemNumber', sort: 'desc', maxWidth: 120, cellStyle: { 'text-align': 'left' } },
      {
        headerName: 'Item Type',
        field: 'typeShort',
        maxWidth: 120,
        cellStyle: { textAlign: 'left' }
      },
      { headerName: 'Worksheet', field: 'worksheetReference', cellStyle: { 'text-align': 'left' } },
      {
        headerName: 'Activity Code',
        field: 'activityCode',
        cellStyle: { textAlign: 'left' }
      },
      {
        headerName: 'Activity Description',
        field: 'activityDescription',
        cellStyle: { textAlign: 'left' },
        // editable: true,
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
    ], []
  )

  const selectedItem = gridSelectionsVar().selectedItem

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
    animateShowChangeCellRenderer: true,
    rowData: data,
    onGridReady: (params) => { params.api.sizeColumnsToFit(); setGridApi(params.api) },
    onGridSizeChanged: (params) => params.api.sizeColumnsToFit(),
  };

  function selectedRow(params) {
    const selected = params.api.getSelectedRows();
    if (selected.length > 0) {
      gridSelectionsVar({
        ...gridSelectionsVar(),
        selectedItem: selected[0],
      });
    }
    else {
      gridSelectionsVar({ ...gridSelectionsVar(), selectedItem: false });
    }
  }

  const isExternalFilterPresent = (params) => {
    return value !== 0;
  }

  const doesExternalFilterPass = node => {
    switch (value) {
      case true:
        return node.data.complete === true;
      case false:
        return node.data.complete === false;
      default:
        return 0;
    }
  };


  React.useEffect(() => {
    if (gridApi) {
      gridApi.onFilterChanged();
    }
  }, [gridApi, value])

  React.useEffect(() => {
    gridSelectionsVar({ ...gridSelectionsVar(), selectedItem: false });
  }, [selectedItem]);

  return (
    <div style={{ marginLeft: 5, marginRight: 5 }}>
      <AgGridReact gridOptions={gridOptions} reactUi={true} className='ag-theme-custom-react' isExternalFilterPresent={isExternalFilterPresent}
        doesExternalFilterPass={doesExternalFilterPass} />
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          sx={{
            "& .MuiBottomNavigationAction-root": {
              color: "navy",
              fontWeight: 'bold',
            },
            "& .Mui-selected ": {
              color: "red",
              fontWeight: 'bolder',
              "& .MuiBottomNavigationAction-label": { fontSize: 18 },
              "& .MuiBottomNavigationAction-icon": { color: 'black' },
            },
            "& .MuiBottomNavigationAction-label": { fontSize: 14 },
            backgroundColor: 'lightgray',
            borderTopStyle: 'solid',
            borderWidth: 2
          }}
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);

          }}
        >
          <BottomNavigationAction label="Show All" value={0} icon={<AllInclusiveIcon />} />
          <BottomNavigationAction label="Complete Only" value={true} icon={<CheckIcon />} />
          <BottomNavigationAction label="Outstanding Only" value={false} icon={<ClearIcon />} />
        </BottomNavigation>
      </Paper>
    </div>
  );
};

export default OrderItemsGrid;
