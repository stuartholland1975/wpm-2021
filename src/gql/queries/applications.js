/** @format */

import { gql } from '@apollo/client';

export const GET_ALL_APPLICATIONS = gql`
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
				areaCount
			}
		}
	}
`;

export const GET_APPLICATION_SUBMISSION_DATA = gql`
	query GetApplicationSubmissionData($id: Int!) {
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
