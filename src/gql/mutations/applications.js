/** @format */

import { gql } from '@apollo/client';

export const CLOSE_CURRENT_APPLICATION = gql`
	mutation CloseCurrentApplication($id: Int!, $ref: String!, $dt: Datetime!) {
		updateApplication(
			input: {
				patch: {
					applicationCurrent: false
					applicationOpen: false
					finalisationReference: $ref
					dateFinalised: $dt
				}
				id: $id
			}
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

export const SUBMIT_APPLICATION = gql`
	mutation SubmitApplication($id: Int!, $ref: String!, $dt: Datetime!) {
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
`;

export const REMOVE_APPLICATION_SUBMISSION_FLAG = gql`
	mutation RemoveApplicationSubmissionFlag($id: Int!) {
		updateApplication(
			input: { patch: { applicationSubmitted: false }, id: $id }
		) {
			clientMutationId
		}
	}
`;
