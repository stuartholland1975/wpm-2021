/* eslint-disable react/prop-types */
/** @format */

import React from 'react';
import ApplicationsGrid from '../grids/ApplicationsGrid';
import { gql, useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { CircularProgress, Box } from '@mui/material';
import ActionButton from '../ui-components/buttons/ActionButton';
import EditButton from '../ui-components/buttons/EditButton';
import DeleteButton from '../ui-components/buttons/DeleteButton';
import { confirmAlert } from "react-confirm-alert";
import { v4 as uuidv4 } from 'uuid'
import { gridSelectionsVar } from '../../cache';

const GET_ALL_APPLICATIONS = gql`
	query GetAllApplications {
		applicationSummaryWithCumulativeValues {
			nodes {
				applicationCurrent
				applicationDate
				applicationNumber
				applicationOpen
				applicationReference
				applicationSubmitted
				thisApplicationValue
				dateSubmitted
				id
				imageCount
				itemCount
				locationCount
				orderCount
				submissionReference
				cumulativeApplicationValue
			}
		}
	}
`;

const CLOSE_CURRENT_APPLICATION = gql`
	mutation CloseCurrentApplication($id: Int!) {
		updateApplication(
			input: { patch: { applicationCurrent: false, applicationOpen: false }, id: $id }
		) {
			application {
      applicationWithValueById {
        applicationCurrent
				applicationDate
				applicationNumber
				applicationOpen
				applicationReference
				applicationSubmitted
				applicationValue
				dateSubmitted
				id
				imageCount
				itemCount
				locationCount
				orderCount
				submissionReference
      }
    }
		}
	}
`;

const SUBMIT_APPLICATION = gql`
mutation SubmitApplication($id:Int!, $ref:String!, $dt: Datetime!) {
  updateApplication(
    input: {
      patch: {
        applicationSubmitted: true
        submissionReference: $ref
        dateSubmitted: $dt
      }
      id: $id
    }
  ) {
    clientMutationId
  }
}
`

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

const ApplicationAdminButtons = ({ currentApplication }) => {
	const selectedApplication = useReactiveVar(gridSelectionsVar).selectedApplication
	const [closeApp] = useMutation(CLOSE_CURRENT_APPLICATION, {});
	const [submitApp] = useMutation(SUBMIT_APPLICATION)

	const handleCloseApplication = () => {
		confirmAlert({
			title: 'Confirm Close Application',
			message: `Are You Sure You Want To Close ${currentApplication[0].applicationReference} ?`,
			buttons: [
				{
					label: 'SUBMIT',
					onClick: () =>
						closeApp({ variables: { id: currentApplication[0].id } })
				},
				{
					label: 'CANCEL',
				},
			],
		});
	};

	const handleSubmitApplication = () => {

		confirmAlert({
			title: 'Confirm Submission',
			message: `Are You Sure You Want To Submit ${selectedApplication.applicationReference} ?`,
			buttons: [
				{
					label: 'SUBMIT',
					onClick: () =>
						submitApp({
							variables: { id: selectedApplication.id, ref: uuidv4(), dt: new Date() }
						})
				},
				{
					label: 'CANCEL',
				},
			],
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
				//	disabled={selectedPeriod !== false}
				/>
			</Item>
			<Item>
				<EditButton
					label='edit application'
				//			disabled={selectedPeriod === false
				/>
			</Item>
			<Item>
				<DeleteButton
					label='delete application'
				//	disabled={selectedPeriod === false}
				/>
			</Item>
		</Box>
	);
};

const Applications = () => {
	const [gridData, setGridData] = React.useState([]);
	const { loading, refetch } = useQuery(GET_ALL_APPLICATIONS, {
		fetchPolicy: 'cache-and-network',
		onCompleted: (data) => setGridData(data.applicationSummaryWithCumulativeValues.nodes),
	});

	const currentApplication = gridData.filter((obj) => obj.applicationCurrent);
	console.log(currentApplication);

	if (loading) return <CircularProgress />;
	return (
		<div>
			<ApplicationAdminButtons currentApplication={currentApplication} refetch={refetch} />
			<ApplicationsGrid data={gridData} pageSize={35} />
		</div>
	);
};

export default Applications;
