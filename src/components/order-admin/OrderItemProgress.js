import React from 'react';
import {gql, useQuery} from '@apollo/client';
import {gridSelectionsVar} from '../../cache';
import {CircularProgress} from '@mui/material';
import WorkProgressGrid from '../grids/WorkProgressGrid';
import OrderItemProgressButtons from "../button-bars/OrderItemProgressButtons";

const GET_INCOMPLETE_LOCATION_ITEMS = gql`
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
			}		
		}
	}
`;

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


const OrderItemProgress = () => {
  const selectedLocation = gridSelectionsVar().selectedLocation;
  const [gridData, setGridData] = React.useState([])

  const {loading} = useQuery(GET_INCOMPLETE_LOCATION_ITEMS, {
    variables: {id: Number(selectedLocation.id)},
    onCompleted: data => setGridData(data.orderdetailWithValues.nodes.map(item => ({
      ...item,
      qtyDone: 0.00
    })))
  });
  const {data: supervisors, loading: supervisorsLoading} =
    useQuery(GET_ALL_SUPERVISORS);

  const {data: currentPeriod, loading: periodLoading} = useQuery(
    GET_CURRENT_PERIOD,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  const processData = () => console.log(gridData, "DATA")

  if (loading || supervisorsLoading || periodLoading)
    return <CircularProgress/>;

  return (
    <div>
      <OrderItemProgressButtons
        process={processData}
      />
      <WorkProgressGrid
        data={gridData}
        supervisors={supervisors.supervisors.nodes}
        currentPeriod={currentPeriod.periods.nodes[0]}
      />
    </div>
  );
};

export default OrderItemProgress;
