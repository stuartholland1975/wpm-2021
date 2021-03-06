import NavigationButton from '../ui-components/buttons/NavigationButton';
import CreateButton from '../ui-components/buttons/CreateButton';
import EditButton from '../ui-components/buttons/EditButton';
import Box from '@mui/material/Box';
import {gridSelectionsVar} from '../../cache';
import {useReactiveVar} from '@apollo/client';
import CreateItemsForm from '../forms/items/CreateItemsForm';
import DeleteItemForm from '../forms/items/DeleteItemForm';

function Item (props) {
	const {sx, ...other} = props;
	return (
		<Box
			sx={{
				pt: 1,
				pb: 1,
				mt: 1,
				mb: 1,
				textAlign: 'center',
				...sx,
			}}
			{...other}
		/>
	);
}

const OrderItemButtons = (props) => {
	const selectedItem = useReactiveVar (gridSelectionsVar).selectedItem;

	return (
		<Box sx={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', mb: 2}}>
			<Item>
				<CreateItemsForm/>
			</Item>
			<Item>
				<EditButton
					label='edit item'
					disabled={
						selectedItem === false || (selectedItem && selectedItem.complete)
					}
				/>
			</Item>
			<Item item>
				<DeleteItemForm
				/>
			</Item>
			<Item item>
				<CreateButton label='spare button' disabled={selectedItem === false}/>
			</Item>
			<Item>
				<NavigationButton
					label='spare button'
					disabled={
						selectedItem === false || (selectedItem && selectedItem.complete)
					}
					//	onClick={() =>
					//		history.push({
					//			pathname: `/orders/admin/${selectedOrder}`,
					//			state: selectedOrder,
					//		})
					//	}
				/>
			</Item>
		</Box>
	);
};

export default OrderItemButtons;
