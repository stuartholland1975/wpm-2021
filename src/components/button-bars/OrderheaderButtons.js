/** @format */

import React from 'react';
import NavigationButton from '../ui-components/buttons/NavigationButton';
import CreateButton from '../ui-components/buttons/CreateButton';
import EditButton from '../ui-components/buttons/EditButton';
import DeleteButton from '../ui-components/buttons/DeleteButton';
import Box from '@mui/material/Box';
import { gridSelectionsVar } from '../../cache';
import { useReactiveVar } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import AddOrderheaderForm from '../forms/AddOrderheaderForm';

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


const OrderheaderButtons = () => {
  const history = useHistory();
  const selectedOrder = useReactiveVar(gridSelectionsVar).selectedOrder;

  function handleImportClick(event) {
    history.push({ pathname: `orders/import/${selectedOrder}` })
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', mb: 2 }}>
      <Item>
        <AddOrderheaderForm />
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
        <CreateButton
          label='import order detail'
          disabled={selectedOrder === false}
          onClick={handleImportClick}
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

export default OrderheaderButtons;
