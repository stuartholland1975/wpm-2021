import React from 'react';
import NavigationButton from '../ui-components/buttons/NavigationButton';
import CreateButton from '../ui-components/buttons/CreateButton';
import EditButton from '../ui-components/buttons/EditButton';
import DeleteButton from '../ui-components/buttons/DeleteButton';
import Box from '@mui/material/Box';
import { gridSelectionsVar } from '../../cache';
import { useReactiveVar } from '@apollo/client';
import { useHistory } from 'react-router-dom';

function Item(props) {
	const { sx, ...other } = props;
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

const OrderImageButtons = () => {
	const history = useHistory();

	const selectedOrder = useReactiveVar(gridSelectionsVar).selectedOrder;

	return (
		<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', mb: 2 }}>
			<Item>
				<CreateButton
					label='create work order'
					disabled={selectedOrder !== false}
				/>
			</Item>
			<Item>
				<EditButton
					label='edit work order'
					disabled={selectedOrder === false}
				/>
			</Item>
			<Item item>
				<DeleteButton
					label='delete work order'
					disabled={selectedOrder === false}
				/>
			</Item>
			<Item>
				<NavigationButton
					label='work order adminisration'
					disabled={selectedOrder === false}
					onClick={() =>
						history.push({
							pathname: `/orders/admin/${selectedOrder}`,
							state: selectedOrder,
						})
					}
				/>
			</Item>
		</Box>
	);
};

export default OrderImageButtons;
