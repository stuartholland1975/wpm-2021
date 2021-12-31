import React from 'react';
import { Box, Container } from '@mui/material'
import UploadButton from '../ui-components/buttons/UploadButton';
import '../../excel.css'
import XLSX from 'xlsx'
import { DataGrid } from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';
import ActionButton from '../ui-components/buttons/ActionButton';
import { makeStyles } from '@mui/styles';
import { gql, useMutation, useLazyQuery } from '@apollo/client'
import { gridSelectionsVar } from '../../cache'
import CancelButton from "../ui-components/buttons/CancelButton";
import { GET_ALL_ORDER_HEADERS } from "../../gql/queries/orderheaders";

const SUBMIT_ORDER_DETAIL_IMPORT = gql`
mutation SubmitOrderDetailImport($input: [OrderImportInput]) {
  wpmGraphqlImportOrderData(input: {orderItem:$input}) {
    clientMutationId
  }
}
`
const CHECK_ACTIVITY_CODE_EXISTS = gql`
  query CheckActivitycodeExists($codes: [String!]) {
    activitycodes(filter: {activityCode: {in: $codes}}) {
      nodes {
        id
         activityCode
         }
      totalCount
      }
    }
`

function Item(props) {
	const { sx, ...other } = props;
	return (
		<Box
			sx={{
				textAlign: 'center',
				...sx,
			}}
			{...other}
		/>
	);
}

const useStyles = makeStyles({
	root: {
		background: '#b6aaaa',
		borderWidth: 1,
		borderColor: 'black',
	},
});

const columns = [
	{ field: 'itemNumber', headerName: 'Item Number', flex: 1 },
	{ field: 'qtyOrdered', headerName: 'Qty Ordered', flex: 1, type: 'number' },
	{ field: 'activityCode', headerName: 'Activity Code', flex: 1 },
	{ field: 'itemTypeId', headerName: 'Item Type', flex: 1 },
	{ field: 'ratesetId', headerName: 'RateSet', flex: 1 },
	{ field: 'packNumber', headerName: 'Pack Number', flex: 1 },
	{ field: 'valueBaseMaterials', headerName: 'Materials Value', flex: 1, type: 'number', }
]

const make_cols = refstr => {
	let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
	for (let i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i }
	return o;
};

function ImportOrderFromTemplate({ hideModal }) {

	const classes = useStyles();

	const selectedOrder = gridSelectionsVar().selectedOrder

	const [activityCodes, setActivityCodes] = React.useState([])
	const [activityCheck, setActivityCheck] = React.useState(false)

	const [params, setParams] = React.useState({
		dataLoaded: false,
		cols: null,
		file: {},
		data: [],
		gridData: []
	})

	const [submitData] = useMutation(SUBMIT_ORDER_DETAIL_IMPORT, {
		variables: { input: params.data },
		refetchQueries: [{
			query: GET_ALL_ORDER_HEADERS,
		}],
		awaitRefetchQueries: true,
	})

	const [checkActivityCodeExists] = useLazyQuery(CHECK_ACTIVITY_CODE_EXISTS, {
		onCompleted: data => {
			setActivityCheck(data.activitycodes.totalCount === activityCodes.length);
			if (data.activitycodes.totalCount === activityCodes.length) {
				alert("ALL ACTIVITIES EXIST")
			} else {
				alert("CHECK ACTIVITY CODES")
			}
		},
		onError: error => console.log(error),
		fetchPolicy: 'cache-and-network'
	})

	function handleChange(e) {
		const files = e.target.files;
		if (files && files[0]) setParams(params => ({ ...params, file: files[0] }));
		const reader = new FileReader();
		const rABS = !!reader.readAsBinaryString;
		reader.onload = (e) => {
			const bstr = e.target.result;
			const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
			const data = XLSX.utils.sheet_to_json(ws).map(item => ({ ...item, orderheaderId: selectedOrder.id }));
			const gridData = data.map(item => ({ ...item, id: uuidv4() }))
			setParams(params => ({
				...params,
				data: data,
				gridData: gridData,
				cols: make_cols(ws['!ref']),
				dataLoaded: true
			}));
		};

		if (rABS) {
			reader.readAsBinaryString(files[0]);
		} else {
			reader.readAsArrayBuffer(files[0]);
		}
		;
	};

	function handleFile() {
		const activityListSet = [...new Set(params.data.map((item) => item.activityCode))];
		const activityList = Array.from(activityListSet)
		setActivityCodes(activityList)
		checkActivityCodeExists({ variables: { codes: activityList } })
	};

	return (
		<Container>
			<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', mb: 2 }}>
				<Item>
					<input
						type='file'
						accept='.xlsx'
						onChange={handleChange}
						id='upload2'
						style={{ display: 'none' }}
					/>
					<label htmlFor='upload2'>
						<UploadButton
							label='select excel file'
							disabled={params.dataLoaded}
							onClick={() => document.getElementById('upload2').click()}
						/>
					</label>
				</Item>
				<Item>
					<ActionButton label="verify" onClick={handleFile} disabled={!params.dataLoaded || activityCheck} />
				</Item>
				<Item>
					<ActionButton label="submit Data" disabled={!params.dataLoaded || !activityCheck}
						onClick={() => submitData(params.data)} />
				</Item>
				<Item>
					<CancelButton label={'close'} onClick={hideModal} />
				</Item>
			</Box>

			{
				params.gridData.length > 0 && <Box sx={{
					height: '80vh', width: '100%'
				}}>
					< DataGrid
						className={classes.root}
						rows={params.gridData}
						columns={columns}
						pageSize={30}
						rowsPerPageOptions={[30]}
					/>
				</Box>
			}

		</Container>
	);
};

export default ImportOrderFromTemplate;