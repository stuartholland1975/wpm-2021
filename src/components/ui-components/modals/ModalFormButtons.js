import React from 'react';
import CreateButton from "../buttons/CreateButton";
import CancelButton from "../buttons/CancelButton";
import Box from "@mui/material/Box";

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

const ModalFormButtons = ({label, hideModal, handleSubmit}) => {
  return (
    <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', mb: 2}}>
      <Item>
        <CreateButton
          label={label}
          onClick={handleSubmit}

        />
      </Item>
      <Item>
        <CancelButton
          label='reset'
        />
      </Item>
      <Item>
        <CancelButton
          label='close'
          onClick={hideModal}
        />
      </Item>

    </Box>
  );
};

export default ModalFormButtons;