import React, {useEffect} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {formatNumberGridTwoDecimals} from '../../functions/commonFunctions';
import {gridSelectionsVar, toggleCompleteVar} from '../../cache';
import {useReactiveVar} from '@apollo/client';

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

const OrderLocationsGrid = ({data}) => {

  const columnDefs = React.useMemo(() =>
    [
      {field: 'id', hide: true, sort: 'asc'},
      {
        headerName: 'Worksheet Ref',
        field: 'worksheetReference',
        cellStyle: {'text-align': 'left'}
      },
      {
        headerName: 'Location',
        field: 'reference',
        cellStyle: {'text-align': 'left'}
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


  const toggleComplete = useReactiveVar(toggleCompleteVar);

  /* useEffect(() => {
        api && api.getFilterInstance('complete', filterInstance => {
            filterInstance.setModel({
                filterType: 'text',
                type: 'equals',
                filter: toggle,
            });
            api.onFilterChanged()
        });
    }, [api, toggle]) */

  console.log(toggleComplete);

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
    animateShowChangeCellRenderer: true,
    onGridReady: (params) => params.api.sizeColumnsToFit(),
    rowData: data,
  };

  function selectedRow(params) {
    const selected = params.api.getSelectedRows();
    if (selected.length > 0) {
      gridSelectionsVar({
        ...gridSelectionsVar(),
        selectedLocation: selected[0],
      });
    }
    else {
      gridSelectionsVar({...gridSelectionsVar(), selectedLocation: false});
    }
  }

  useEffect(() => {
    gridSelectionsVar({...gridSelectionsVar(), selectedLocation: false});
  }, []);
  return (
    <div style={{marginLeft: 5, marginRight: 5}}>
      <AgGridReact
        reactUi={false}
        gridOptions={gridOptions}
        className='ag-theme-custom-react'
      />
    </div>
  );
};
export default OrderLocationsGrid;
