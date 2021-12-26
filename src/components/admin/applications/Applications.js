/** @format */

import React from 'react';
import ApplicationsGrid from '../../grids/ApplicationsGrid';
import {
	useMutation,
	useQuery,
	useReactiveVar,
	useLazyQuery,
} from '@apollo/client';
import { CircularProgress, Box } from '@mui/material';
import ActionButton from '../../ui-components/buttons/ActionButton';
import { confirmAlert } from 'react-confirm-alert';
import { v4 as uuidv4 } from 'uuid';
import { gridSelectionsVar } from '../../../cache';
import XLSX from 'xlsx';
import {
	GET_ALL_APPLICATIONS,
	GET_APPLICATION_SUBMISSION_DATA,
} from '../../../gql/queries/applications';
import {
	CLOSE_CURRENT_APPLICATION,
	SUBMIT_APPLICATION,
	REMOVE_APPLICATION_SUBMISSION_FLAG,
} from '../../../gql/mutations/applications';
import DownloadIcon from '@mui/icons-material/Download';

function Item(props) {
	const { sx, ...other } = props;
	return (
		<Box
			sx={{
				pt: 1,
				pb: 1,
				mt: 0,
				mb: 0,
				textAlign: 'center',
				...sx,
			}}
			{...other}
		/>
	);
}

const exportJS = (element) => {
	const {
		appHeader,
		appAreas,
		appLocations,
		appItems,
		appWorksheets,
		appOrders,
		description,
	} = element;
	const wb = XLSX.utils.book_new();
	const w1 = XLSX.utils.json_to_sheet(appHeader);
	const w2 = XLSX.utils.json_to_sheet(appAreas);
	const w3 = XLSX.utils.json_to_sheet(appLocations);
	const w4 = XLSX.utils.json_to_sheet(appItems);
	const w5 = XLSX.utils.json_to_sheet(appWorksheets);
	const w6 = XLSX.utils.json_to_sheet(appOrders);

	XLSX.utils.book_append_sheet(wb, w1, 'Application Header');
	XLSX.utils.book_append_sheet(wb, w2, 'Application Area');
	XLSX.utils.book_append_sheet(wb, w3, 'Application Locations');
	XLSX.utils.book_append_sheet(wb, w4, 'Application Items');
	XLSX.utils.book_append_sheet(wb, w5, 'Application Worksheets');
	XLSX.utils.book_append_sheet(wb, w6, 'Application Orders');

	XLSX.writeFile(
		wb,
		`${appHeader[0].application_reference} ${description}.xlsx`,
	);
};

const ApplicationAdminButtons = ({ currentApplication }) => {
	const selectedApplication =
		useReactiveVar(gridSelectionsVar).selectedApplication;

	const [closeApp] = useMutation(CLOSE_CURRENT_APPLICATION, {
		refetchQueries: [
			{
				query: GET_ALL_APPLICATIONS,
			},
		],
		awaitRefetchQueries: true,
	});

	const [submitApp] = useMutation(SUBMIT_APPLICATION, {
		refetchQueries: [
			{
				query: GET_ALL_APPLICATIONS,
			},
		],
		awaitRefetchQueries: true,
	});

	const [reverseSubmitApp] = useMutation(REMOVE_APPLICATION_SUBMISSION_FLAG, {
		refetchQueries: [
			{
				query: GET_ALL_APPLICATIONS,
			},
		],
		awaitRefetchQueries: true,
	});

	const [downloadSubmissionData] = useLazyQuery(
		GET_APPLICATION_SUBMISSION_DATA,
		{
			fetchPolicy: 'network-only',
			onCompleted: (data) => {
				const appHeader =
					data.submittedApplicationByApplicationId.applicationHeader;
				const appAreas = data.submittedApplicationByApplicationId.areas;
				const appItems = data.submittedApplicationByApplicationId.orderdetails;
				const appLocations =
					data.submittedApplicationByApplicationId.sitelocations;
				const appWorksheets =
					data.submittedApplicationByApplicationId.worksheets;
				const appOrders = data.submittedApplicationByApplicationId.orderheaders;
				const workBooks = appAreas.map((item) => ({
					id: item.area_id,
					description: item.area_description,
				}));
				const workSheets = workBooks.map((item) => ({
					id: item.id,
					description: item.description,
					appHeader: appHeader,
					appAreas: appAreas.filter((obj) => obj.area_id === item.id),
					appOrders: appOrders.filter((obj) => obj.area_id === item.id),
					appLocations: appLocations.filter((obj) => obj.area_id === item.id),
					appItems: appItems.filter((obj) => obj.area_id === item.id),
					appWorksheets: appWorksheets.filter((obj) => obj.area_id === item.id),
				}));
				workSheets.forEach((element) => exportJS(element));
			},
		},
	);

	const handleCloseApplication = () => {
		confirmAlert({
			title: 'Confirm Close Application',
			message: `Are You Sure You Want To Close ${currentApplication[0].applicationReference} ?`,
			buttons: [
				{
					label: 'SUBMIT',
					onClick: () =>
						closeApp({
							variables: {
								id: currentApplication[0].id,
								ref: uuidv4(),
								dt: new Date(),
							},
						}),
				},
				{
					label: 'CANCEL',
				},
			],
		});
	};

	const handleSubmitApplication = () => {
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<div className='custom-ui'>
						<h1>Confirm Submission</h1>
						<p>{`Are You Sure You Want To Submit ${selectedApplication.applicationReference} ?`}</p>
						<button
							onClick={() =>
								submitApp({
									variables: {
										id: selectedApplication.id,
										ref: uuidv4(),
										dt: new Date(),
									},
								}).then(() => {
									onClose();
									gridSelectionsVar({
										...gridSelectionsVar(),
										selectedApplication: false,
									});
								})
							}>
							SUBMIT
						</button>
						<button
							onClick={() => {
								onClose();
							}}>
							CANCEL
						</button>
					</div>
				);
			},
		});
	};

	const handleReverseSubmitApplication = () => {
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<div className='custom-ui'>
						<h1>Confirm Submission</h1>
						<p>{`Are You Sure You Want To Reverse Submit ${selectedApplication.applicationReference} ?`}</p>
						<button
							onClick={() =>
								reverseSubmitApp({
									variables: { id: selectedApplication.id },
								}).then(() => {
									onClose();
									gridSelectionsVar({
										...gridSelectionsVar(),
										selectedApplication: false,
									});
								})
							}>
							REVERSE SUBMIT
						</button>
						<button
							onClick={() => {
								onClose();
							}}>
							CANCEL
						</button>
					</div>
				);
			},
		});
	};

	const handleExportDetail = () => {
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<div className='custom-ui'>
						<h1>Confirm Download</h1>
						<p>{`Are You Sure You Want To Download ${selectedApplication.applicationReference} ?`}</p>
						<button
							onClick={() =>
								downloadSubmissionData({
									variables: { id: selectedApplication.id },
								}).then(() => {
									//exportJS()
									onClose();
									/* gridSelectionsVar({
										...gridSelectionsVar(),
										selectedApplication: false,
									}); */
								})
							}>
							DOWNLOAD
						</button>
						<button
							onClick={() => {
								onClose();
							}}>
							CANCEL
						</button>
					</div>
				);
			},
		});
	};

	return (
		<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', mb: 2 }}>
			<Item>
				<ActionButton
					label='close current application'
					onClick={handleCloseApplication}
				/>
			</Item>
			<Item>
				<ActionButton
					label='submit application'
					onClick={handleSubmitApplication}
					disabled={
						selectedApplication === false ||
						selectedApplication?.applicationSubmitted ||
						selectedApplication?.applicationOpen
					}
				/>
			</Item>
			<Item>
				<ActionButton
					label='remove submission flag'
					disabled={
						selectedApplication === false ||
						selectedApplication?.applicationSubmitted === false
					}
					onClick={handleReverseSubmitApplication}
				/>
			</Item>
			<Item>
				<ActionButton
					label='download submission data'
					startIcon={<DownloadIcon />}
					disabled={
						selectedApplication === false ||
						selectedApplication?.applicationSubmitted === false
					}
					onClick={handleExportDetail}
				/>
			</Item>
			{/* <Item>
				<ExportApplicationData />
			</Item> */}
		</Box>
	);
};

const Applications = () => {
	const [gridData, setGridData] = React.useState([]);
	const { loading, refetch } = useQuery(GET_ALL_APPLICATIONS, {
		fetchPolicy: 'cache-and-network',
		onCompleted: (data) =>
			setGridData(data.applicationSummaryWithCumulativeValues.nodes),
	});

	const currentApplication = gridData.filter((obj) => obj.applicationCurrent);

	if (loading) return <CircularProgress />;
	return (
		<div>
			<ApplicationAdminButtons
				currentApplication={currentApplication}
				refetch={refetch}
			/>
			<ApplicationsGrid data={gridData} pageSize={35} />
		</div>
	);
};

export default Applications;
