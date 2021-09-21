import React from 'react';
import NavigateButton from '../ui-components/buttons/NavigationButton'
import {Box} from "@mui/material";

function Item(props) {
  const {sx, ...other} = props;
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

const AdminHome = () => {
  return (
    <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', mb: 2}}>

      <Item item>
        <NavigateButton label={"GLOBAL DOCUMENTS"} fullWidth/>
      </Item>
      <Item item>
        <NavigateButton label={"SPARE ADMINISTRATION"} fullWidth/>
      </Item>
      <Item item>
        <NavigateButton label={"SPARE ADMINISTRATION"} fullWidth/>
      </Item>
      <Item item>
        <NavigateButton label={"SPARE ADMINISTRATION"} fullWidth/>
      </Item>
    </Box>
  );
};

export default AdminHome;