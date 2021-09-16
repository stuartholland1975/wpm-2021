import React from 'react';
import NavigationButton from '../ui-components/buttons/NavigationButton';
import { Box } from '@mui/material';
import { useHistory } from 'react-router-dom';

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

const OrderAdminButtons = () => {
  const history = useHistory();
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', mb: 2 }}>
      <Item>
        <NavigationButton
          label='locations'
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
        <NavigationButton label='documents' />
      </Item>
      <Item>
        <NavigationButton label='images' />
      </Item>
    </Box>
  );
};

export default OrderAdminButtons;
