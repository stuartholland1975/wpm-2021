import React from 'react';
import { useModal } from 'react-modal-hook';
import ReactModal from 'react-modal';
import CreateOrderWithDetailForm from './CreateOrderWithDetailForm';
import CreateButton from '../../../ui-components/buttons/CreateButton';
import { useReactiveVar } from '@apollo/client';
import { gridSelectionsVar } from '../../../../cache';


const FormModal = () => {
	const selectedOrder = useReactiveVar(gridSelectionsVar).selectedOrder;

	const [showModal, hideModal] = useModal(() => (
		<ReactModal isOpen appElement={document.getElementById('root')}>

			<CreateOrderWithDetailForm hideModal={hideModal} />
		</ReactModal>
	));

	return (
		<div>
			<CreateButton
				label='CREATE WORK ORDER WITH DETAIL'
				onClick={showModal}
				disabled={selectedOrder !== false}
			/>
		</div>
	);
};

export default FormModal;