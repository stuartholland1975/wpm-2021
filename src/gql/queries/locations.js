import { gql } from '@apollo/client'

export const GET_INCOMPLETE_LOCATION_ITEMS = gql`
	query GetIncompleteLocationItems($id: Int!) {
		orderdetailWithValues(
			filter: { complete: { equalTo: false }, sitelocationId: { equalTo: $id } }
		) {
			nodes {
				activityCode
				activityDescription
				itemNumber
				typeShort
				valueOs
				qtyOs
				qtyOrdered
				id
				orderheaderId
				unitPayableTotal
				sitelocationId
			}
		}
	}
`;

export const GET_SINGLE_LOCATION = gql`
	query GetSingleLocation($id: Int!) {
		sitelocationWithValueById(id: $id) {
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
	}
`;