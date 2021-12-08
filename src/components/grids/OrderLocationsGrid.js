import React, { useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { formatNumberGridTwoDecimals } from '../../functions/commonFunctions';
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
  // floatingFilter: true,
};

const columnTypes = {
  dateColumn: {
    filter: 'agDateColumnFilter',
  },
};

const OrderLocationsGrid = ({ data }) => {

  const [value, setValue] = React.useState(false);
  const [gridApi, setGridApi] = React.useState(null);

  const columnDefs = React.useMemo(() =>
    [
      { field: 'id', hide: true, sort: 'asc' },
      {
        headerName: 'Worksheet Ref',
        field: 'worksheetReference',
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Location',
        field: 'reference',
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Item Count',
        field: 'itemCount',
        type: 'numericColumn',
        //maxWidth: 120,
      },
      {
        headerName: 'Items Complete',
        field: 'itemsComplete',
        type: 'numericColumn',
        //	maxWidth: 150,
      },
      {
        headerName: 'Items O/S',
        type: 'numericColumn',
        //	maxWidth: 150,

        valueGetter: function (params) {
          return params.data.itemCount - params.data['itemsComplete'];
        },
      },
      {
        headerName: 'Image Count',
        field: 'imageCount',
        type: 'numericColumn',
        //	maxWidth: 150,
      },

      {
        headerName: 'Order Value',
        field: 'orderValue',
        type: 'numericColumn',
        valueGetter: (params) => Number(params.data.orderValue),
        valueFormatter: formatNumberGridTwoDecimals,
      },
      {
        headerName: 'Done Value',
        field: 'valueComplete',
        type: 'numericColumn',
        valueGetter: (params) => Number(params.data.valueComplete),
        valueFormatter: formatNumberGridTwoDecimals,
      },
      {
        headerName: 'To Do Value',
        type: 'numericColumn',
        valueGetter: function (params) {
          return params.data['orderValue'] - params.data['valueComplete'];
        },
        valueFormatter: formatNumberGridTwoDecimals,
      },
      {
        headerName: 'Applied Value',
        field: 'valueApplied',
        type: 'numericColumn',
        valueGetter: (params) => Number(params.data.valueApplied),
        valueFormatter: formatNumberGridTwoDecimals,
      },
      {
        headerName: 'To Apply Value',
        type: 'numericColumn',
        valueGetter: function (params) {
          return params.data['valueComplete'] - params.data['valueApplied'];
        },
        valueFormatter: formatNumberGridTwoDecimals,
      },
      {
        headerName: 'Ave Item Value',
        type: 'numericColumn',
        valueGetter: function (params) {
          return params.data['orderValue'] / params.data['itemCount'];
        },
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

  const gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: defaultColDef,
    columnTypes: columnTypes,
    pagination: true,
    paginationPageSize: 30,
    domLayout: 'autoHeight',
    rowSelection: 'single',
    onRowSelected: selectedRow,
    animateRows: true,
    rowClassRules: rowClassRules,
    onGridReady: (params) => { params.api.sizeColumnsToFit(); setGridApi(params.api) },
    rowData: data,

  };

  useEffect(() => {
    if (gridApi) {
      gridApi.onFilterChanged();
    }
  }, [gridApi, value])

  function selectedRow(params) {
    const selected = params.api.getSelectedRows();
    if (selected.length > 0) {
      gridSelectionsVar({
        ...gridSelectionsVar(),
        selectedLocation: selected[0],
      });
    }
    else {
      gridSelectionsVar({ ...gridSelectionsVar(), selectedLocation: false });
    }
  }

  useEffect(() => {
    gridSelectionsVar({ ...gridSelectionsVar(), selectedLocation: false });
  }, []);

  return (
    <div style={{ marginLeft: 5, marginRight: 5 }}>
      <AgGridReact
        reactUi={true}
        gridOptions={gridOptions}
        className='ag-theme-custom-react'
        isExternalFilterPresent={isExternalFilterPresent}
        doesExternalFilterPass={doesExternalFilterPass}
      />
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
export default OrderLocationsGrid;
