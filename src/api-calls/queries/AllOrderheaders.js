import {useState} from 'react';
import {gql, useQuery} from '@apollo/client';

const GET_ALL_ORDER_HEADERS = gql`
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
			}
		}
	}
`;

export default function AllOrderheaders() {
  /** @namespace data.orderheaderWithValues **/
  const [data, setData] = useState([]);
  const {loading, networkStatus} = useQuery(GET_ALL_ORDER_HEADERS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => setData(data.orderheaderWithValues.nodes),
  });


  return [data, loading, networkStatus];
}
