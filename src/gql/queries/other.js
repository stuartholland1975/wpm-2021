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

export const GET_ITEM_TYPES = gql`
query GetItemTypes {
  itemTypes {
    nodes {
      id
      typeLong
      typeShort
    }
  }
}
`

export const GET_RATESET_HEADERS = gql`
query GetRatesetHeaders {
  ratesetHeaders {
    nodes {
      id
      description
    }
  }
}
`
export const GET_RATESET_PRICES = gql`
query GetRatesetPrices($id: Int!) {
  pricesWithUplifts(condition: {ratesetHeaderId: $id}, orderBy: ACTIVITY_CODE_ASC) {
    nodes {
      activityCode
      activityDescription
      id
      ratesetHeaderId
    }
    totalCount
  }
}
`