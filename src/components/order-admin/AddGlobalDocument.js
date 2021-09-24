import ReactModal from "react-modal";
import {useModal} from "react-modal-hook";
import AttachDocumentForm from "../forms/AttachDocumentForm";
import NavigationButton from "../ui-components/buttons/NavigationButton";
import React from "react";


const AddGlobalDocument = (props) => {


  const [showModal, hideModal] = useModal(() => (
    <ReactModal isOpen appElement={document.getElementById('root')} maxWidth={'md'}>
      <h3>ATTACH GLOBAL DOCUMENT</h3>
      <hr/>
      <AttachDocumentForm
        hideModal={hideModal}
        existing={props.data.orderheaderDocuments.nodes.map(
          (item) => item.document
        )}
      />

    </ReactModal>
  ));

  return (
    <div>
      <NavigationButton label={'GLOBAL DOCUMENT ADMIN'} onClick={showModal}/>
    </div>
  );
};

export default AddGlobalDocument;
