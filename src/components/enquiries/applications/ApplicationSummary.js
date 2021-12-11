/** @format */

import React from 'react';
import ApplicationStats from '../../application-admin/ApplicationStats';
import { useQuery, gql, useReactiveVar } from '@apollo/client';
import { gridSelectionsVar } from '../../../cache';
import { CircularProgress, Grid } from '@mui/material';
import AreaByApp from './AreaByApp';
import Box from '@mui/material/Box';
import OrdersByApp from './OrdersByApp';
import { camelizeKeys } from '../../../functions/commonFunctions';

const GET_APPLICATION_STATS = gql`
	query GetApplicationStats($id: Int!) {
		applicationWithValue(id: $id) {
			id
			applicationReference
			applicationCurrent
			applicationDate
			applicationNumber
			applicationOpen
			applicationSubmitted
			applicationValue
			dateSubmitted
			imageCount
			itemCount
			locationCount
			orderCount
			submissionReference
			areaCount
		}
	}
`;

const GET_SUBMITTED_APPLICATION_STATS = gql`
	query GetSubmittedApplicationStats($id: Int!) {
		submittedApplicationByApplicationId(applicationId: $id) {
			applicationHeader
			applicationId
			areas
			images
			orderdetails
			orderheaders
			sitelocations
			worksheets
		}
	}
`;

const ApplicationSummary = () => {
	const selectedApplication =
		useReactiveVar(gridSelectionsVar).selectedApplication;
	const [appHeaderData, setAppHeaderData] = React.useState({});
	const [appAreaData, setAppAreaData] = React.useState([]);
	const [appOrderData, setAppOrderData] = React.useState([]);
	const { loading: appStatsLoading } = useQuery(
		selectedApplication.applicationSubmitted
			? GET_SUBMITTED_APPLICATION_STATS
			: GET_APPLICATION_STATS,
		{
			variables: { id: selectedApplication.id },
			fetchPolicy: 'network-only',
			onCompleted: (data) => {
				setAppHeaderData(() =>
					selectedApplication.applicationSubmitted
						? camelizeKeys(
								data.submittedApplicationByApplicationId.applicationHeader[0],
						  )
						: data.applicationWithValue,
				);
				setAppAreaData(() =>
					selectedApplication.applicationSubmitted
						? data.submittedApplicationByApplicationId.areas.map((item) =>
								camelizeKeys(item),
						  )
						: false,
				);
				setAppOrderData(() =>
					selectedApplication.applicationSubmitted
						? data.submittedApplicationByApplicationId.orderheaders.map(
								(item) => camelizeKeys(item),
						  )
						: false,
				);
			},
		},
	);

	if (appStatsLoading) return <CircularProgress />;
	return (
		<div>
			<ApplicationStats data={appHeaderData} />
			<Box m={2}>
				{' '}
				<Grid container={true} spacing={2}>
					<Grid item xs={6}>
						<AreaByApp areaData={appAreaData} />
					</Grid>
					<Grid item xs={6}>
						<OrdersByApp orderData={appOrderData} />
					</Grid>
				</Grid>
			</Box>
		</div>
	);
};

export default ApplicationSummary;
