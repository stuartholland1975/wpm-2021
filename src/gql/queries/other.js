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

export const GET_ALL_AREAS = gql`
query getAreas {
  areas {
    nodes {
      id
      description
    }
  }
}
`

export const GET_ALL_WORKTYPES = gql`
query getWorktypes {
  worktypes {
    nodes {
      id
      description
    }
  }
}`

export const GET_ALL_ORDERHEADER_STATUSES = gql`
query getOrderheaderStatus {
  orderheaderStatuses {
    nodes {
      id
      statusDescription
    }
  }
}
`

export const GET_ORDER_LOCATIONS = gql`
	query GetOrderLocations($id: Int!) {
		sitelocationWithValues(filter: { orderheaderId: { equalTo: $id } }) {
			nodes {
				complete
				id
				itemCount
				itemsComplete
				orderValue
				orderheaderId
				reference
				valueApplied
				valueComplete
				worksheetReference
				imageCount
			}
			totalCount
		}
	}
`;