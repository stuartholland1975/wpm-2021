import { gql } from '@apollo/client'

export const CREATE_BULK_WORKSHEETS = gql`
	mutation CreateBulkWorksheets(
		$input: WorksheetCreateBulkWorksheetsInput!
		$orderId: Int!
	) {
		worksheetCreateBulkWorksheets(input: $input) {
			query {
				orderheaderWithValueById(id: $orderId) {
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
		}
	}
`;