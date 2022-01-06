import {gridSelectionsVar} from '../../../cache';
import {useReactiveVar, useMutation} from '@apollo/client';
import {confirmAlert} from 'react-confirm-alert';
import DeleteButton from '../../ui-components/buttons/DeleteButton';
import {GET_ORDER_DETAILS} from '../../order-admin/OrderItems';
import {GET_SINGLE_ORDERHEADER} from '../../../gql/queries/orderheaders';
import {DELETE_ORDERDETAIL} from '../../../gql/mutations/orderdetails';


const DeleteItemForm = () => {
	const selectedItem = useReactiveVar (gridSelectionsVar).selectedItem
	const [deleteSelectedItem] = useMutation (DELETE_ORDERDETAIL, {
		refetchQueries: [{
			query: GET_ORDER_DETAILS,
			variables: {id: gridSelectionsVar ().selectedOrder.id}
		}, {
			query: GET_SINGLE_ORDERHEADER,
			variables: {id: gridSelectionsVar ().selectedOrder.id}
		}],
		awaitRefetchQueries: true,
	})

	const onSubmit = () => confirmAlert ({
		customUI: ({onClose}) => {
			return (
				<div className="custom-ui">
					<h1>Confirm Item Deletion</h1>
					<p>{`Are You Sure You Want To Delete Item Number: ${selectedItem.itemNumber}`}</p>
					<button onClick={() => deleteSelectedItem ({
						variables: {id: selectedItem.id},
					}).then (() => onClose ())}
					>SUBMIT
					</button>
					<button onClick={() => {
						onClose ()
					}}
					>CANCEL
					</button>
				</div>
			);
		}
	});

	return (
		<div>
			<DeleteButton
				label='delete Item'
				disabled={
					selectedItem === false ||
					(selectedItem && selectedItem.complete)
				}
				onClick={onSubmit}
			/>
		</div>
	);
};

export default DeleteItemForm;