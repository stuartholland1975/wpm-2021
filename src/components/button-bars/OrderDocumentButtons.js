import React from 'react';
import Box from "@mui/material/Box";
import DeleteButton from "../ui-components/buttons/DeleteButton";
import AddGlobalDocument from "../order-admin/AddGlobalDocument";

function Item(props) {
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

const OrderDocumentButtons = (props) => (
  <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', mb: 2}}>
    <Item>
      <AddGlobalDocument data={props.data}/>
    </Item>
    <Item>
      <DeleteButton label="REMOVE EXISTING DOCUMENT"/>
    </Item>

  </Box>

);

export default OrderDocumentButtons;