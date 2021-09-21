import React from 'react';
import NavigationButton from '../ui-components/buttons/NavigationButton';
import CreateButton from '../ui-components/buttons/CreateButton';
import EditButton from '../ui-components/buttons/EditButton';
import DeleteButton from '../ui-components/buttons/DeleteButton';
import Box from '@mui/material/Box';
import {gridSelectionsVar} from '../../cache';
import {useReactiveVar} from '@apollo/client';
import OrderImageAdmin from "../order-admin/OrderImageAdmin";

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

const OrderLocationButtons = (props) => {
  const selectedLocation = useReactiveVar(gridSelectionsVar).selectedLocation;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', mb: 2 }}>
      <Item>
        <CreateButton
          label='create location'
          disabled={selectedLocation !== false}
        />
      </Item>
      <Item>
        <EditButton
          label='edit location'
          disabled={
            selectedLocation === false ||
            (selectedLocation && selectedLocation.complete)
          }
        />
      </Item>
      <Item item>
        <DeleteButton
          label='delete location'
          disabled={
            selectedLocation === false ||
            (selectedLocation && selectedLocation.complete)
          }
        />
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

export default OrderLocationButtons;
