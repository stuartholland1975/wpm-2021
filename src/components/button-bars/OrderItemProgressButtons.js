import React from 'react';
import CreateButton from '../ui-components/buttons/CreateButton';
import Box from '@mui/material/Box';
import {gridSelectionsVar} from '../../cache';
import {useReactiveVar} from '@apollo/client';

//import {useHistory} from 'react-router-dom';

function Item(props) {
  const {sx, ...other} = props;
  return (
    <Box
      sx={{
        pt: 1,
        pb: 1,
        mt: 1,
        mb: 1,
        width: 800,
        ...sx,
      }}
      {...other}
    />
  );
}

const OrderItemProgressButtons = (props) => {
  const selectedLocation = useReactiveVar(gridSelectionsVar).selectedLocation;
  // const selectedOrder = useReactiveVar(gridSelectionsVar).selectedOrder;
  // const history = useHistory();

  return (
    <Box sx={{display: 'flex', mb: 2, justifyContent: 'space-around'}}>
      <Item>
        <CreateButton
          label='save changes'
          onClick={() => props.process(selectedLocation)}
        />
      </Item>
      {/* <Item>
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
          onClick={() =>
            history.push({
              pathname: `/orders/admin/locations/progress/${selectedLocation.id}`,
              state: selectedOrder,
            })
          }
        />
      </Item>*/}
    </Box>
  );
};

export default OrderItemProgressButtons;
