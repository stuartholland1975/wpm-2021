import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { formatNumberGridTwoDecimals } from '../../functions/commonFunctions';
import SimpleDateEditor from './cell-renderers/SimpleDateEditor';
import SimpleNumericEditor from "./cell-renderers/SimpleNumericEditor";
import SimpleSelectEditor from './cell-renderers/SimpleSelectEditor'

/*
export const CREATE_BULK_WORKSHEETS = gql`
  mutation CreateBulkWorksheets(
    $input: WorksheetCreateBulkWorksheetsInput!
    $orderId: Int!
  ) {
    worksheetCreateBulkWorksheets(input: $input) {
      query {
        orderheaderWithValueById(id: $orderId) {
          area
          averageItemValue
          averageLocationValue
          id
          itemCount
          itemCountBoq
          itemCountVarn
          itemsComplete
          itemsCompleteBoq
          itemsCompleteVarn
          locationCount
          orderNumber
          orderValueLabour
          orderValueMaterials
          orderValueOther
          orderValueTotal
          orderValueTotalApplied
          orderValueTotalBoq
          orderValueTotalComplete
          orderValueTotalVarn
          projectTitle
          workType
          issuedDate
        }
      }
    }
  }
`;
*/

const WorkProgressGrid = ({ data, supervisors, currentPeriod }) => {
  /** @namespace params.data.valueOs **/
  /** @namespace params.data.qtyOs **/


  const columnDefs = React.useMemo(() => [
    { headerName: 'Item Ref', field: 'itemNumber' },
    { headerName: 'Item Type', field: 'typeShort' },
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
      headerName: 'Qty Os',
      field: 'qtyOs',
      valueFormatter: formatNumberGridTwoDecimals,
      type: 'numericColumn',
    },
    {
      headerName: 'Value Os',
      field: 'valueOs',
      valueFormatter: formatNumberGridTwoDecimals,
      type: 'numericColumn',
    },
    {
      headerName: 'Qty Done',
      colId: 'qtyDone',
      field: 'qtyDone',
      type: 'numericColumn',
      editable: true,
      cellEditorFramework: SimpleNumericEditor,
      valueFormatter: formatNumberGridTwoDecimals,
    },
    {
      headerName: 'Supervisor',
      colId: 'supervisor',
      field: 'supervisor',
      editable: true,
      cellEditorFramework: SimpleSelectEditor,
      width: 150,
      cellEditorParams: (params) => ({
        options: supervisors,
        defaults: data,
        lastRowSupervisor: params.api.getRowNode(params.rowIndex - 1),
      }),
    },
    {
      headerName: 'Date Complete',
      field: 'date',
      editable: true,
      cellEditorFramework: SimpleDateEditor,
      cellEditorParams: (params) => ({
        lastRowDate: params.api.getRowNode(params.rowIndex - 1),
        currentPeriod: currentPeriod,
      }),
      valueFormatter: (params) =>
        params.value && params.value.split('-').reverse().join('/')
    },
    {
      headerName: 'Value Complete',
      valueGetter: (params) => (params.data.qtyDone) * (params.data.valueOs) / (params.data.qtyOs),
      valueFormatter: formatNumberGridTwoDecimals,
      type: 'numericColumn',
    },
  ], [])

  const defaultColDef = {
    filter: false,
    sortable: false,
    resizable: true,
  };

  const gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: defaultColDef,
    pagination: false,
    singleClickEdit: true,
    stopEditingWhenGridLosesFocus: false,
  };

  const onDataRendered = (params) => {
    params.api.startEditingCell({
      rowIndex: 0,
      colKey: 'qtyDone',
    });
    params.api.sizeColumnsToFit();
  };

  return (
    <>
      <div className='ag-theme-custom-react' style={{ height: 850 }}>
        <AgGridReact
          gridOptions={gridOptions}
          rowData={data}
          onFirstDataRendered={onDataRendered}
          onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
        //reactUi={true}
        //  getRowNodeId={data => data.id}
        />
      </div>
    </>
  );
};

export default WorkProgressGrid;
