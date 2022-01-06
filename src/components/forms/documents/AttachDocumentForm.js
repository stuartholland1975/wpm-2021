/** @format */

import TransferList from '../../ui-components/other/TransferList';
import {gql, useMutation, useQuery} from '@apollo/client';
import {CircularProgress} from '@mui/material';
import {gridSelectionsVar, mutationApiVar} from '../../../cache';
import ModalFormButtons from '../../ui-components/modals/ModalFormButtons';
import {
	removeCommon,
	removedFromInitial,
} from '../../../functions/commonFunctions';
import {GET_SINGLE_ORDERHEADER} from '../../order-admin/OrderStats';
import {GET_ORDER_DOCUMENTS} from '../../order-admin/OrderDocuments';

const GET_UNATTACHED_GLOBAL_DOCUMENTS = gql`
	query GetUnattachedGlobalDocuments($existing: [Int!]) {
		documents(
			condition: { global: true }
			filter: { id: { notIn: $existing } }
		) {
			nodes {
				id
				title
			}
		}
	}
`;

const REMOVE_GLOBAL_DOCUMENT_FROM_ORDER = gql`
	mutation RemoveGlobalDocumentFromOrder(
		$mnPatch: [OrderheaderDocumentPatch!]
	) {
		mnDeleteOrderheaderDocument(input: { mnPatch: $mnPatch }) {
			deletedOrderheaderDocumentNodeId
		}
	}
`;
const ATTACH_GLOBAL_DOCUMENT = gql`
	mutation AttachGlobalDocument(
		$mnOrderheaderDocument: [OrderheaderDocumentInput!]
	) {
		mnCreateOrderheaderDocument(
			input: { mnOrderheaderDocument: $mnOrderheaderDocument }
		) {
			document {
				createdAt
				headerDocumentFile
				global
				id
				title
			}
		}
	}
`;
const AttachDocumentForm = (props) => {
	const existingGlobal = props.existing.filter ((obj) => obj.global);
	const selectedOrder = gridSelectionsVar ().selectedOrder;
	const {data, loading} = useQuery (GET_UNATTACHED_GLOBAL_DOCUMENTS, {
		variables: {existing: existingGlobal.map ((item) => item.id)},
	});
	const [removeDocument] = useMutation (REMOVE_GLOBAL_DOCUMENT_FROM_ORDER, {
		refetchQueries: [
			{
				query: GET_SINGLE_ORDERHEADER,
				variables: {id: Number (selectedOrder.id)},
			},
			{
				query: GET_ORDER_DOCUMENTS,
				variables: {orderId: Number (selectedOrder.id)},
			},
		],
		awaitRefetchQueries: true,
	});
	const [attachDocument] = useMutation (ATTACH_GLOBAL_DOCUMENT, {
		refetchQueries: [
			{
				query: GET_SINGLE_ORDERHEADER,
				variables: {id: selectedOrder.id},
			},
			{
				query: GET_ORDER_DOCUMENTS,
				variables: {orderId: selectedOrder.id},
			},
		],
		awaitRefetchQueries: true,
	});

	const handleSubmit = () => {
		const selected = mutationApiVar ().data.map ((item) => item.id);
		const existing = existingGlobal.map ((item) => item.id);
		const additions = removeCommon (existing, selected);
		const deletions = removedFromInitial (existing, selected);
		if ( deletions.length > 0 && additions.length === 0 ) {
			const deletionsApiObject = deletions.map ((item) => ({
				orderheaderId: Number (selectedOrder.id),
				documentId: Number (item),
			}));
			removeDocument ({
				variables: {mnPatch: deletionsApiObject},
			}).then (props.hideModal ());
		} else if ( additions.length > 0 && deletions.length === 0 ) {
			const additionsApiObject = additions.map ((item) => ({
				orderheaderId: selectedOrder.id,
				documentId: Number (item),
			}));
			attachDocument ({
				variables: {mnOrderheaderDocument: additionsApiObject},
			}).then (props.hideModal ());
		} else if ( additions.length > 0 && deletions.length > 0 ) {
			const deletionsApiObject = deletions.map ((item) => ({
				orderheaderId: Number (selectedOrder.id),
				documentId: Number (item),
			}));
			const additionsApiObject = additions.map ((item) => ({
				orderheaderId: Number (selectedOrder.id),
				documentId: Number (item)

			}));
			const result = Promise.all ([
				attachDocument ({
					variables: {mnOrderheaderDocument: additionsApiObject},
				}),
				removeDocument ({
					variables: {mnPatch: deletionsApiObject},
				}),
			]);
			result.then (props.hideModal ());
		}
	};

	if ( loading ) return <CircularProgress/>;

	return (
		<>
			<TransferList existing={existingGlobal} options={data.documents.nodes}/>
			<ModalFormButtons
				label={'SAVE CHANGES'}
				hideModal={props.hideModal}
				handleSubmit={handleSubmit}
			/>
		</>
	);
};

export default AttachDocumentForm;
