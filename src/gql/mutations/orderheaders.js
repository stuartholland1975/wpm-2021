import { gql } from '@apollo/client';


export const CREATE_ORDERHEADER = gql`
mutation CreateOrderheader($input: OrderheaderInput!) {
  createOrderheader(
    input: {orderheader: $input}
  ) {
   orderheader {
      orderheaderWithValueById {
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
}
`