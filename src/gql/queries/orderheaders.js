import { gql } from '@apollo/client'

/*
export const GET_SINGLE_ORDERHEADER = gql`
	query GetSingleOrderheader($id: Int!) {
		orderheaderWithValue(id: $id) {
			area
			averageItemValue
			averageLocationValue
			id
			itemCount
			itemCountBoq
			itemCountVarn
			itemsComplete
			itemsCompleteBoq
			itemsCompleteVarn
			locationCount
			locationsComplete
			statusDescription
			orderNumber
			orderValueLabour
			orderValueMaterials
			orderValueOther
			orderValueTotal
			orderValueTotalApplied
			orderValueTotalBoq
			orderValueTotalComplete
			orderValueTotalVarn
			projectTitle
			workType
			issuedDate
			documentCount
			imageCount
		}
	}
`;*/

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
