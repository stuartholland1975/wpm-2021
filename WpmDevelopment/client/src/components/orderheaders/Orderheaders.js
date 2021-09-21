import React from 'react';
import OrderheaderGrid from '../grids/OrderheaderGrid';
import OrderheaderButtons from '../button-bars/OrderheaderButtons';
import {gql, useQuery} from '@apollo/client';
import {CircularProgress} from '@mui/material';

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

const Orderheaders = () => {
	const { data, loading } = useQuery(GET_ALL_ORDER_HEADERS, {
		fetchPolicy: 'cache-and-network',
	});

	if (loading) {
		return <CircularProgress />;
	}

	return (
		<>
			<OrderheaderButtons />
			<OrderheaderGrid data={data.orderheaderWithValues.nodes} />
		</>
	);
};

export default Orderheaders;
