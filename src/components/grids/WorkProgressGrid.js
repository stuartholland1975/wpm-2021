import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import {formatNumberGridTwoDecimals} from '../../functions/commonFunctions';
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

const WorkProgressGrid = ({data, supervisors, currentPeriod}) => {
  /** @namespace params.data.valueOs **/
  /** @namespace params.data.qtyOs **/
  //const batchRef = React.useRef(uuidv4());
  // const history = useHistory();
  // const apiRef = React.useRef();
  // const [api, setApi] = React.useState();


  /* const [createWorksheets] = useMutation(CREATE_BULK_WORKSHEETS, {
    onCompleted: () => {
      hideConfirmAlert();
      history.push({
        pathname: `/orders/processing/locations/${history.location.state}`,
        state: history.location.state,
      });
    },
  }); */

  const columnDefs = [
    {headerName: 'Item Ref', field: 'itemNumber'},
    {headerName: 'Item Type', field: 'typeShort'},
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
  ];

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

  /*const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
    setApi(params.api);
    apiRef.current = params.api;
    params.api.startEditingCell({
      rowIndex: 0,
      colKey: 'qtyDone',
    });
  };*/

  const onDataRendered = (params) => {
    params.api.startEditingCell({
      rowIndex: 0,
      colKey: 'qtyDone',
    });
    params.api.sizeColumnsToFit();
  };

  /* const saveWorksheets = () => {
    const worksheetData =
      apiRef.current.gridOptionsWrapper.gridOptions.rowData.filter(
        (obj) => obj.qtyDone !== 0
      );
    const worksheetObject =
      worksheetData &&
      worksheetData.map((item) => ({
        orderdetailId: item.id,
        periodNumberId: currentPeriod.id,
        supervisorId: supervisors.filter(
          (obj) => obj.displayName === item.supervisor
        )[0].id,
        qtyComplete: item.qtyDone,
        dateComplete: item.date,
        batchId: batchRef.current,
      }));
    createWorksheets({
      variables: {
        input: { worksheets: worksheetObject },
        orderId: Number(history.location.state),
      },
    });
  }; */

  /* const [showConfirmAlert, hideConfirmAlert] = useModal(() => {
    const worksheetData = apiRef.current.gridOptionsWrapper.gridOptions.rowData;
    const rowsWithQty = worksheetData.filter((obj) => obj.qtyDone !== 0);
    const errorCheck = rowsWithQty.filter((obj) => obj.supervisor && obj.date);
    const submissionvalue = rowsWithQty
      .map((item) => Number(item.qtyDone) * Number(item.unitPayableTotal))
      .reduce((total, amount) => total + amount);

    return (
      <ConfirmAlertModal
        show={true}
        title={'SAVE WORK PROGRESS ?'}
        content={
          <>
            <div>
              YOUR DATA HAS {rowsWithQty.length} ROWS WITH ADJUSTED QUANTITIES
            </div>
            <div>
              {' '}
              {rowsWithQty.length - errorCheck.length} OF THESE ROWS HAVE ERRORS
            </div>
            <div>
              {' '}
              VALUE OF SUBMISSION IS: {formatNumberTwoDecimals(submissionvalue)}
            </div>
          </>
        }
        //  content={'ARE YOU SURE YOU WANT TO CREATE WORKSHEETS'}
        size={'lg'}
        hideModal={hideConfirmAlert}
        confirmAction={saveWorksheets}
        errorCount={rowsWithQty.length - errorCheck.length}
        confirmLabel='OK'
        displayCloseButton={true}
      />
    );
  }); */

  /* const toggleQty = () => {
    toggleOutstanding();
    const newColumns = api.getColumnDefs();
    const cId = newColumns.findIndex((col) => col.colId === 'qtyDone');
    newColumns[cId].editable = allOutstanding;
    api.setColumnDefs(newColumns);
  }; */

  return (
    <>
      {/* 	<hr />
			<OrderItemProgressButtons
				toggleOutstanding={toggleQty}
				saveProgress={showConfirmAlert}
			/> */}


      <div className='ag-theme-custom-react' style={{height: 850}}>
        <AgGridReact
          gridOptions={gridOptions}
          rowData={data}
          //	onGridReady={onGridReady}
          onFirstDataRendered={onDataRendered}
          onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
          // reactUi={true}
          //  getRowNodeId={data => data.id}
        />
      </div>
    </>
  );
};

export default WorkProgressGrid;
