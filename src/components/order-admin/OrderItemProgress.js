/** @format */

import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { gridSelectionsVar } from '../../cache';
import { CircularProgress } from '@mui/material';
import WorkProgressGrid from '../grids/WorkProgressGrid';
import OrderItemProgressButtons from '../button-bars/OrderItemProgressButtons';
import { useHistory } from 'react-router-dom';
import { formatNumberTwoDecimals } from '../../functions/commonFunctions';
import { v4 as uuidv4 } from 'uuid';
import { confirmAlert } from 'react-confirm-alert';
import { GET_INCOMPLETE_LOCATION_ITEMS, GET_SINGLE_LOCATION } from '../../gql/queries/locations';
import { CREATE_BULK_WORKSHEETS } from '../../gql/mutations/worksheets';
import { GET_ALL_SUPERVISORS, GET_CURRENT_PERIOD } from '../../gql/queries/other';

const OrderItemProgress = () => {
	/** @namespace data.orderdetailWithValues **/
	/** @namespace currentPeriod.periods **/

	const history = useHistory();

	const batchRef = React.useRef(uuidv4());

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
				}))
			),
	});

	const { data: supervisors, loading: supervisorsLoading } =
		useQuery(GET_ALL_SUPERVISORS);

	const { data: currentPeriod, loading: periodLoading } = useQuery(
		GET_CURRENT_PERIOD,
		{
			fetchPolicy: 'cache-and-network',
		}
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
				pathname: `/orders/admin/locations/${selectedOrder.id}`,
				state: selectedOrder.id,
			});
		},
	});

	const processData = () => {
		const editedItems = gridData.filter((obj) => obj.qtyDone > 0);
		const apiObject = editedItems.map(({
			date,
			id,
			qtyDone,
			supervisor,
			sitelocationId,
			orderheaderId,
			unitPayableTotal
		}) => ({
			supervisorId: supervisors.supervisors.nodes
				.filter((obj) => obj.displayName === supervisor)
				.map((item) => item.id)[0],
			periodNumberId: currentPeriod.periods.nodes[0].id,
			dateComplete: date,
			qtyComplete: qtyDone,
			orderdetailId: id,
			batchId: batchRef.current,
			orderheaderId,
			sitelocationId,
			valueComplete: qtyDone * Number(unitPayableTotal)
		}));
		const errorCheck = apiObject
			.map(
				(item) =>
					-1 !== Object.values(item).findIndex((v) => v == null || v === '')
			)
			.includes(true);
		if (errorCheck) {
			confirmAlert({
				customUI: ({ onClose }) => {
					return (
						<div className="custom-ui">
							<h1>Submission Contains Errors!</h1>
							<p>Please Correct Them And Try Again</p>
							<button
								onClick={() => {
									onClose()
								}}
							>Close
							</button>
						</div>
					);
				}
			});

		} else {
			const submissionValue = formatNumberTwoDecimals(
				editedItems
					.map((item) => (item.valueOs / item.qtyOs) * item.qtyDone)
					.reduce((item, total) => item + total, 0)
			);
			confirmAlert({
				customUI: ({ onClose }) => {
					return (
						<div className="custom-ui">
							<h1>Confirm Submission</h1>
							<p>{`Submission Value Is: ${submissionValue}`}</p>
							<button onClick={() => submitWorksheets({
								variables: {
									input: { worksheets: apiObject },
									orderId: selectedOrder.id,
								},
							}).then(() => onClose())}
							>SUBMIT
							</button>
							<button onClick={() => {
								onClose()
							}}
							>CANCEL
							</button>
						</div>
					);
				}
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
