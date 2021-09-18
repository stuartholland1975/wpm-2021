import React from 'react';
import {useModal} from "react-modal-hook";
import {gql, useMutation} from "@apollo/client";
import ReactModal from "react-modal";
import CreateButton from "../ui-components/buttons/CreateButton";
import ImageForm from "../forms/ImageForm";


const UPLOAD_IMAGE = gql`
  mutation CreateImage($input: CreateImageInput!) {
    createImage(input: $input) {
      image {
        orderheaderId
      }
    }
  }
`;

const OrderImageAdmin = () => {
    const [uploadImage] = useMutation((UPLOAD_IMAGE))
    const [showModal, hideModal] = useModal(() => (
    <ReactModal isOpen >
        <h3>UPLOAD IMAGE</h3>
        <hr/>
      <ImageForm hideModal={hideModal}/>
    </ReactModal>
  ))

  return (<CreateButton label="UPLOAD IMAGE" onClick={showModal}/>  )
};

export default OrderImageAdmin;