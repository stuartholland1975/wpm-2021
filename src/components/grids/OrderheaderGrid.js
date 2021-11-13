import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { formatDateGrid, formatNumberGridNoDecimals, } from '../../functions/commonFunctions';
import { gridSelectionsVar } from '../../cache';

const OrderheaderGrid = ({ data }) => {
  const columnDefs = useMemo(
    () => [
      {
        headerName: 'Work Instruction',
        field: 'orderNumber',
        cellStyle: { fontWeight: 'bold' },
        maxWidth: 160,
      },
      {
        headerName: 'Project Title',
        field: 'projectTitle',
        //minWidth: 300,
        flex: 2,
      },
      {
        headerName: 'Work Type',
        field: 'workType',
        flex: 1,
      },
      {
        headerName: 'Area',
        field: 'area',
        maxWidth: 100,
      },
      {
        headerName: 'Date Issued',
        field: 'issuedDate',
        filter: 'agDateColumnFilter',
        valueFormatter: formatDateGrid,
        maxWidth: 150,
      },
      {
        headerName: 'Order Value',
        field: 'orderValueTotal',
        valueFormatter: formatNumberGridNoDecimals,
        type: 'numericColumn',
        cellStyle: { fontWeight: 'bold' },
        filter: 'agNumberColumnFilter',
        maxWidth: 150,
      },
      {
        headerName: 'Done Value',
        field: 'orderValueTotalComplete',
        valueFormatter: formatNumberGridNoDecimals,
        type: 'numericColumn',
        filter: 'agNumberColumnFilter',
        cellStyle: { fontWeight: 'bold' },
        maxWidth: 150,
      },
      {
        headerName: 'Location Count',
        field: 'locationCount',
        type: 'numericColumn',
        filter: 'agNumberColumnFilter',
        maxWidth: 150,
      },
      {
        headerName: 'Ave Loc Value',
        field: 'averageLocationValue',
        type: 'numericColumn',
        valueFormatter: formatNumberGridNoDecimals,
        filter: 'agNumberColumnFilter',
        maxWidth: 150,
      },

      {
        headerName: 'Item Count',
        field: 'itemCount',
        type: 'numericColumn',
        filter: 'agNumberColumnFilter',
        maxWidth: 150,
      },
      {
        headerName: 'Ave Item Value',
        field: 'averageItemValue',
        type: 'numericColumn',
        valueFormatter: formatNumberGridNoDecimals,
        filter: 'agNumberColumnFilter',
        maxWidth: 150,
      },
      {
        headerName: 'Variation Count',
        field: 'itemCountVarn',
        type: 'numericColumn',
        filter: 'agNumberColumnFilter',
        maxWidth: 150,
      },

      {
        headerName: 'Image Count',
        type: 'numericColumn',
        valueFormatter: formatNumberGridNoDecimals,
        field: 'imageCount',
        filter: 'agNumberColumnFilter',
        maxWidth: 150,
      },
      {
        headerName: 'Doc Count',
        field: 'documentCount',
        type: 'numericColumn',
        valueFormatter: formatNumberGridNoDecimals,
        filter: 'agNumberColumnFilter',
        maxWidth: 150,
      },

      {
        headerName: 'To Do Value',
        valueGetter: (params) =>
          params.data.orderValueTotal - params.data.orderValueTotalComplete,
        valueFormatter: formatNumberGridNoDecimals,
        type: 'numericColumn',
        filter: 'agNumberColumnFilter',
        sort: 'desc',
        maxWidth: 150,
      },
      {
        headerName: 'Applied Value',
        field: 'orderValueTotalApplied',
        valueFormatter: formatNumberGridNoDecimals,
        type: 'numericColumn',
        filter: 'agNumberColumnFilter',
        maxWidth: 150,
      },
      {
        headerName: 'Order Status',
        field: 'statusDescription',
        maxWidth: 150,
      },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
    }),
    []
  );
  const columnTypes = useMemo(
    () => ({
      dateColumn: {
        filter: 'agDateColumnFilter',
      },
    }),
    []
  );

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

  React.useEffect(
    () => gridSelectionsVar({ ...gridSelectionsVar, selectedOrder: false }),
    []
  );

  function selectedRow(params) {
    const selected = params.api.getSelectedNodes();
    if (selected.length > 0) {
      gridSelectionsVar({
        ...gridSelectionsVar(),
        selectedOrder: selected[0].data.id,
      });
    } else {
      gridSelectionsVar({ ...gridSelectionsVar(), selectedOrder: false });
    }
  }

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };

  return (
    <div className='ag-theme-custom-react' style={{ margin: 5 }}>
      <AgGridReact
        gridOptions={gridOptions}
        rowData={data}
        onGridReady={onGridReady}
        reactUi={true}
        onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
      />
    </div>
  );
};

export default OrderheaderGrid;
