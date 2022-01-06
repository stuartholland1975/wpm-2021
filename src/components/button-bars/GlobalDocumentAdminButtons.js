import {Box} from '@mui/material';
import AddDocumentForm from '../forms/documents/AddDocumentForm';

import EditButton from '../ui-components/buttons/EditButton';
import DeleteButton from '../ui-components/buttons/DeleteButton';

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

const GlobalDocumentAdminButtons = () => {
	return (
		<Box sx={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', mb: 2}}>
			<Item>
				<AddDocumentForm/>
			</Item>
			<Item>
				<EditButton label='EDIT GLOBAL DOCUMENT' disabled/>
			</Item>
			<Item>
				<DeleteButton label='DELETE GLOBAL DOCUMENT' disabled/>
			</Item>
		</Box>
	);
};

export default GlobalDocumentAdminButtons;
