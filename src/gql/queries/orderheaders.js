import { gql } from '@apollo/client'



export const GET_SINGLE_ORDERHEADER = gql`
query MyQuery($id: Int!) {
  orderheaderWithValue(id: $id) {
    area
    averageItemValue
    averageLocationValue
    endDate
    issuedDate
    itemCount
    locationCount
    imageCount
    orderNumber
    orderValueLabour
    orderValueMaterials
    orderValueOther
    orderValueTotal
    projectTitle
    startDate
    workType
  }
}
`

export const GET_ALL_ORDER_HEADERS = gql`
	query GetOrderheadersWithValues {
		orderheaderWithValues {
			nodes {
				area
				averageItemValue
				averageLocationValue
				id
				itemCount
				itemsComplete
				locationsComplete
				itemCountVarn
				locationCount
				orderNumber
				projectTitle
				workType
				issuedDate
				documentCount
				orderValueTotal
				orderValueTotalComplete
				orderValueTotalApplied
				imageCount
				statusDescription
				startDate
				endDate
				areaId
				worktypeId
				orderStatusId
			}
		}
	}
`;