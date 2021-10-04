import React from 'react';
import { useModal } from 'react-modal-hook';
import ReactModal from 'react-modal';
import { Grid, TextField } from '@mui/material';
import CreateButton from '../ui-components/buttons/CreateButton';
import CancelButton from '../ui-components/buttons/CancelButton';
import { useMutation, gql, useReactiveVar } from '@apollo/client';
import { gridSelectionsVar } from '../../cache';

const UPLOAD_GLOBAL_DOCUMENT = gql`
	mutation UploadGlobalDocument($input: CreateDocumentInput!) {
		createDocument(input: $input) {
			document {
				id
			}
		}
	}
`;
const GET_GLOBAL_DOCUMENTS = gql`
	query GetGlobalDocuments {
		documents(condition: { global: true }) {
			nodes {
				createdAt
				headerDocumentFile
				id
				title
				orderheaderDocuments {
					totalCount
				}
			}
		}
	}
`;

const DocumentForm = ({ hideModal }) => {
	const [documentFile, setDocumentFile] = React.useState();
	const [submitDocument] = useMutation(UPLOAD_GLOBAL_DOCUMENT, {
		refetchQueries: [
			{
				query: GET_GLOBAL_DOCUMENTS,
				fetchPolicy: 'network-only',
			},
		],
		awaitRefetchQueries: true,
		onCompleted: () => {
			hideModal();
		},
	});

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log(event);
		let fd = new FormData(event.target);
		const title = fd.get('title');
		submitDocument({
			variables: {
				input: {
					document: {
						title,
						headerDocumentFile: documentFile,
						global: true,
					},
				},
			},
		});
	};
	return (
		<form onSubmit={handleSubmit}>
			<Grid container spacing={2}>
				<Grid item xs={6}>
					<TextField
						label='Title'
						name='title'
						required
						variant='filled'
						fullWidth
					/>
				</Grid>
				<Grid item xs={6}>
					<TextField
						label='Select Document File'
						type='file'
						fullWidth
						variant='filled'
						InputLabelProps={{ shrink: true }}
						required
						onChange={(event) =>
							event.target.files.length > 0 &&
							setDocumentFile(event.target.files[0])
						}
					/>
				</Grid>
				<Grid item xs={6}>
					<CreateButton type={'submit'} label={'upload document'} />
				</Grid>
				<Grid item xs={6}>
					<CancelButton
						label={'CLOSE'}
						type={'button'}
						onClick={hideModal}
						fullWidth
					/>
				</Grid>
			</Grid>
		</form>
	);
};

const AddDocumentForm = () => {
	const selectedDocument = useReactiveVar(gridSelectionsVar).selectedDocument;
	const [showModal, hideModal] = useModal(() => (
		<ReactModal isOpen appElement={document.getElementById('root')}>
			<h3>UPLOAD IMAGE</h3>
			<hr />
			<DocumentForm hideModal={hideModal} />
		</ReactModal>
	));
	return (
		<CreateButton
			label='UPLOAD DOCUMENT'
			onClick={showModal}
			disabled={selectedDocument !== false}
		/>
	);
};

export default AddDocumentForm;