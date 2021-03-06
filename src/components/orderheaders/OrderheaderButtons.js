/** @format */

import React from 'react';
import NavigationButton from '../ui-components/buttons/NavigationButton';
import DeleteButton from '../ui-components/buttons/DeleteButton';
import Box from '@mui/material/Box';
import {gridSelectionsVar} from '../../cache';
import {useReactiveVar} from '@apollo/client';
import {useHistory} from 'react-router-dom';
import AddOrderheaderForm from '../forms/orderheaders/AddOrderheaderForm';
import EditOrderheaderForm from '../forms/orderheaders/EditOrderheaderForm';
import OrderImport from "./OrderImport";

//import FormModal from '../forms/multi-step/order/FormModal';

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


const OrderheaderButtons = () => {
	const history = useHistory ();
	const selectedOrder = useReactiveVar (gridSelectionsVar).selectedOrder;

	function handleImportClick (event) {
		history.push ({pathname: `orders/import/${selectedOrder.id}`})
	}

	return (
		<Box sx={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', mb: 2}}>
			<Item>
				<AddOrderheaderForm/>
			</Item>
			{/*  <Item>
        <FormModal />
      </Item> */}
			<Item>
				<EditOrderheaderForm/>
			</Item>
			<Item item>
				<DeleteButton
					label='delete work order'
					disabled={selectedOrder === false}
				/>
			</Item>
			<Item>
				<OrderImport/>
			</Item>
			<Item>
				<NavigationButton
					label='work order administration'
					disabled={selectedOrder === false}
					onClick={() =>
						history.push ({
							pathname: `/orders/admin/${selectedOrder.id}`,
							state: selectedOrder.id,
						})
					}
				/>
			</Item>
		</Box>
	);
};

export default OrderheaderButtons;
