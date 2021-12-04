/** @format */

import React from 'react';
import ApplicationsGrid from '../grids/ApplicationsGrid';
import {gql, useMutation, useQuery} from '@apollo/client';
import {CircularProgress, Box} from '@mui/material';
import ActionButton from '../ui-components/buttons/ActionButton';
import EditButton from '../ui-components/buttons/EditButton';
import DeleteButton from '../ui-components/buttons/DeleteButton';
import {confirmAlert} from "react-confirm-alert";

const GET_ALL_APPLICATIONS = gql`
	query GetAllApplications {
		applicationWithValues {
			nodes {
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

function Item (props) {
	const {sx, ...other} = props;
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

const ApplicationAdminButtons = ({currentApplication}) => {
	const [closeApp] = useMutation (CLOSE_CURRENT_APPLICATION, {
		//   onCompleted: (data) => refetch(),
	});

	const handleCloseApplication = () => {

		confirmAlert ({
			title: 'Confirm Submission',
			message: `Are You Sure You Want To Close ${currentApplication[0].applicationReference} ?`,
			buttons: [
				{
					label: 'SUBMIT',
					onClick: () =>
						closeApp ({variables: {id: currentApplication[0].id}})
				},
				{
					label: 'CANCEL',
					//onClick: () => alert('Click No'),
				},
			],
		});
	};

	const handleSubmitApplication = () => {
		console.log (currentApplication);

	};

	return (
		<Box sx={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', mb: 2}}>
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
	const [gridData, setGridData] = React.useState ([]);
	const {loading, refetch} = useQuery (GET_ALL_APPLICATIONS, {
		fetchPolicy: 'cache-and-network',
		onCompleted: (data) => setGridData (data.applicationWithValues.nodes),
	});

	const currentApplication = gridData.filter ((obj) => obj.applicationCurrent);
	console.log (currentApplication);

	if ( loading ) return <CircularProgress/>;
	return (
		<div>
			<ApplicationAdminButtons currentApplication={currentApplication} refetch={refetch}/>
			<ApplicationsGrid data={gridData} pageSize={35}/>
		</div>
	);
};

export default Applications;
