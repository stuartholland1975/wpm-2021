import { gql } from '@apollo/client'

export const GET_ORDER_DETAILS = gql`
	query GetOrderdetails($id: Int!) {
		orderdetailWithValues(filter: { orderheaderId: { equalTo: $id } }) {
			nodes {
				activityCode
				activityDescription
				complete
				id
				orderheaderId
				qtyApplied
				qtyComplete
				qtyOrdered
				typeShort
				unitPayableTotal
				valueApplied
				valueComplete
				valuePayableTotal
				worksheetReference
				itemNumber
			}
			totalCount
		}
	}
`;
