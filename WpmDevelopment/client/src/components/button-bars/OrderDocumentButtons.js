import React from 'react';
import CreateButton from "../ui-components/buttons/CreateButton";
import Box from "@mui/material/Box";
import DeleteButton from "../ui-components/buttons/DeleteButton";

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

const OrderDocumentButtons = (props) => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', mb: 2 }}>
        <Item>
            <CreateButton label="ADD EXISTING DOCUMENT"/>
        </Item>
        <Item>
            <DeleteButton label="REMOVE EXISTING DOCUMENT"/>
        </Item>

    </Box>

);

export default OrderDocumentButtons;