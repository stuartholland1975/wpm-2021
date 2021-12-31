import React from 'react';
import {useModal} from 'react-modal-hook';
import ReactModal from 'react-modal';
import ImportOrderFromTemplate from "../forms/ImportOrderFromTemplate";
import CreateButton from "../ui-components/buttons/CreateButton";
import {useReactiveVar} from "@apollo/client";
import {gridSelectionsVar} from "../../cache";

function OrderImport (props) {
	const selectedOrder = gridSelectionsVar ().selectedOrder;
	const [showModal, hideModal] = useModal (() => (
		<ReactModal isOpen appElement={document.getElementById ('root')}>
			<h3>IMPORT ORDER DETAIL</h3>
			<hr/>
			<ImportOrderFromTemplate hideModal={hideModal}/>
		</ReactModal>
	));

	return (
		<CreateButton
			label='import order detail'
			disabled={selectedOrder === false}
			onClick={showModal}
		/>
	);
}

export default OrderImport;