/** @format */

import React from 'react';
import NavigationButton from '../ui-components/buttons/NavigationButton';
import { Box } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';

function Item(props) {
	const { sx, ...other } = props;
	return (
		<Box
			sx={{
				textAlign: 'center',
				...sx,
			}}
			{...other}
		/>
	);
}

const OrderAdminButtons = (props) => {
	const history = useHistory();
	let routeMatch = useLocation();

	return (
		<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', mb: 2 }}>
			<Item>
				<NavigationButton
					label='locations'
					disabled={routeMatch.pathname.startsWith('/orders/admin/locations')}
					onClick={() =>
						history.push({
							pathname: `/orders/admin/locations/${history.location.state}`,
							state: history.location.state,
						})
					}
				/>
			</Item>
			<Item>
				<NavigationButton
					label='items'
					disabled={routeMatch.pathname.startsWith('/orders/admin/items')}
					onClick={() =>
						history.push({
							pathname: `/orders/admin/items/${history.location.state}`,
							state: history.location.state,
						})
					}
				/>
			</Item>
			<Item item>
				<NavigationButton label='worksheets' />
			</Item>
			<Item>
				<NavigationButton
					label='documents'
					disabled={routeMatch.pathname.startsWith('/orders/admin/documents')}
					onClick={() =>
						history.push({
							pathname: `/orders/admin/documents/${history.location.state}`,
							state: history.location.state,
						})
					}
				/>
			</Item>
			<Item>
				<NavigationButton
					label='view images'
					disabled={routeMatch.pathname.startsWith('/orders/admin/images')}
					onClick={() =>
						history.push({
							pathname: `/orders/admin/images/${history.location.state}`,
							state: history.location.state,
						})
					}
				/>
			</Item>
		</Box>
	);
};

export default OrderAdminButtons;
