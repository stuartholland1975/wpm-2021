import React from 'react';
import { useModal } from "react-modal-hook";
import ReactModal from "react-modal";
import CreateButton from "../ui-components/buttons/CreateButton";
import ImageForm from "../forms/ImageForm";
import { useReactiveVar } from '@apollo/client';
import { gridSelectionsVar } from '../../cache';


const OrderImageAdmin = () => {

  const selectedLocation = useReactiveVar(gridSelectionsVar).selectedLocation

  const [showModal, hideModal] = useModal(() => (
    <ReactModal isOpen >
      <h3>UPLOAD IMAGE</h3>
      <hr />
      <ImageForm hideModal={hideModal} />
    </ReactModal>
  ))

  return (<CreateButton disabled={selectedLocation === false} label="UPLOAD IMAGE" onClick={showModal} />)
};

export default OrderImageAdmin;