import NavigationButton from '../ui-components/buttons/NavigationButton';
import Box from '@mui/material/Box';
import {gridSelectionsVar} from '../../cache';
import {useReactiveVar} from '@apollo/client';
import OrderImageAdmin from '../order-admin/OrderImageAdmin';
import {useHistory} from 'react-router-dom';
import CreateLocationsForm from '../forms/locations/CreateLocationsForm';
import EditLocationForm from '../forms/locations/EditLocationForm';
import DeleteLocationForm from '../forms/locations/DeleteLocationForm';

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

const OrderLocationButtons = (props) => {
	const selectedLocation = useReactiveVar (gridSelectionsVar).selectedLocation;
	const selectedOrder = useReactiveVar (gridSelectionsVar).selectedOrder;
	const history = useHistory ();

	return (
		<Box sx={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', mb: 2}}>
			<Item>
				<CreateLocationsForm/>
			</Item>
			<Item>
				<EditLocationForm/>
			</Item>
			<Item item>
				<DeleteLocationForm/>
			</Item>
			<Item item>
				<OrderImageAdmin/>
			</Item>
			<Item>
				<NavigationButton
					label='update work progress'
					disabled={
						selectedLocation === false ||
						(selectedLocation && selectedLocation.complete)
					}
					onClick={() =>
						history.push ({
							pathname: `/orders/admin/progress/${selectedLocation.id}`,
							state: selectedOrder.id,
						})
					}
				/>
			</Item>
		</Box>
	);
};

export default OrderLocationButtons;
