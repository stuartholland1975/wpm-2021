import {useState} from "react";
import {gql, useQuery, useReactiveVar} from "@apollo/client";
import {gridSelectionsVar} from "../../cache";

const GET_SINGLE_ORDERHEADER = gql`
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
`;

export default function SingleOrderheader() {
  /** @namespace data.orderheaderWithValue **/
  const [data, setData] = useState()
  const selectedOrder = useReactiveVar(gridSelectionsVar).selectedOrder;
  useQuery(GET_SINGLE_ORDERHEADER, {
    variables: {id: selectedOrder},
    onCompleted: data => setData(data.orderheaderWithValue)
  })


  return data
}

