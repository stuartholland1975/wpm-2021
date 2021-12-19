import { gql } from '@apollo/client'

export const GET_ALL_SUPERVISORS = gql`
	query GetAllSupervisors {
		supervisors {
			nodes {
				displayName
				id
			}
		}
	}
`;

export const GET_CURRENT_PERIOD = gql`
	query GetCurrentPeriod {
		periods(condition: { current: true }) {
			nodes {
				current
				id
				periodNumber
				week
				weekCommencingDate
				weekEndingDate
				year
			}
		}
	}
`;