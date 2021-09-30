/** @format */

import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { gridSelectionsVar } from '../../cache';
import { CircularProgress } from '@mui/material';
import WorkProgressGrid from '../grids/WorkProgressGrid';
import OrderItemProgressButtons from '../button-bars/OrderItemProgressButtons';
import { useHistory } from 'react-router-dom';
import { formatNumberTwoDecimals } from '../../functions/commonFunctions';

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
				id
			}
		}
	}
`;

const CREATE_BULK_WORKSHEETS = gql`
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

const GET_SINGLE_LOCATION = gql`
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

const OrderItemProgress = () => {
	/** @namespace data.orderdetailWithValues **/
	/** @namespace currentPeriod.periods **/

	const history = useHistory();

	const selectedLocation = gridSelectionsVar().selectedLocation;
	const selectedOrder = gridSelectionsVar().selectedOrder;

	const [gridData, setGridData] = React.useState([]);

	const { loading } = useQuery(GET_INCOMPLETE_LOCATION_ITEMS, {
		variables: { id: Number(selectedLocation.id) },

		onCompleted: (data) =>
			setGridData(
				data.orderdetailWithValues.nodes.map((item) => ({
					...item,
					qtyDone: 0.0,
				})),
			),
	});

	const { data: supervisors, loading: supervisorsLoading } =
		useQuery(GET_ALL_SUPERVISORS);

	const { data: currentPeriod, loading: periodLoading } = useQuery(
		GET_CURRENT_PERIOD,
		{
			fetchPolicy: 'cache-and-network',
		},
	);

	const [submitWorksheets] = useMutation(CREATE_BULK_WORKSHEETS, {
		refetchQueries: [
			{
				query: GET_SINGLE_LOCATION,
				variables: { id: selectedLocation.id },
			},
		],
		awaitRefetchQueries: true,
		onCompleted: () => {
			history.push({
				pathname: `/orders/admin/locations/${selectedOrder}`,
				state: selectedOrder,
			});
		},
	});

	const processData = () => {
		const editedItems = gridData.filter((obj) => obj.qtyDone > 0);
		const apiObject = editedItems.map(({ date, id, qtyDone, supervisor }) => ({
			supervisorId: supervisors.supervisors.nodes
				.filter((obj) => obj.displayName === supervisor)
				.map((item) => item.id)[0],
			periodNumberId: currentPeriod.periods.nodes[0].id,
			dateComplete: date,
			qtyComplete: qtyDone,
			orderdetailId: id,
		}));
		const errorCheck = apiObject
			.map(
				(item) =>
					-1 !== Object.values(item).findIndex((v) => v == null || v === ''),
			)
			.includes(true);
		if (errorCheck) {
			alert('SUBMISSION CONTAINS ERRORS');
		} else {
			const submissionValue = formatNumberTwoDecimals(
				editedItems
					.map((item) => (item.valueOs / item.qtyOs) * item.qtyDone)
					.reduce((item, total) => item + total),
			);
			alert('SUBMISSION VALUE IS ' + submissionValue);
			submitWorksheets({
				variables: {
					input: { worksheets: apiObject },
					orderId: selectedOrder,
				},
			});
		}
	};
	if (loading || supervisorsLoading || periodLoading)
		return <CircularProgress />;

	return (
		<div>
			<OrderItemProgressButtons process={processData} />
			<WorkProgressGrid
				data={gridData}
				supervisors={supervisors.supervisors.nodes}
				currentPeriod={currentPeriod.periods.nodes[0]}
			/>
		</div>
	);
};

export default OrderItemProgress;