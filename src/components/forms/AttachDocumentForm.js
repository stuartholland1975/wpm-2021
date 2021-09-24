/** @format */

import TransferList from '../ui-components/other/TransferList';
import {gql, useMutation, useQuery} from "@apollo/client";
import {CircularProgress} from "@mui/material";
import {gridSelectionsVar, mutationApiVar} from "../../cache";
import ModalFormButtons from "../ui-components/modals/ModalFormButtons";
import React from "react";
import {removeCommon, removedFromInitial} from "../../functions/commonFunctions";

const GET_UNATTACHED_GLOBAL_DOCUMENTS = gql`
  query GetUnattachedGlobalDocuments($existing: [Int!]) {
  documents(condition: {global: true}, filter: {id: {notIn: $existing}}) {
    nodes {
      id
      title
    }
  }
}
`;
const REMOVE_GLOBAL_DOCUMENT_FROM_ORDER = gql`
mutation RemoveGlobalDocumentFromOrder($orderId: Int!, $docId: Int!) {
  deleteOrderheaderDocument(input: {orderheaderId: $orderId, documentId: $docId}) {
    deletedOrderheaderDocumentNodeId
  }
}
`
const ATTACH_GLOBAL_DOCUMENT = gql`
mutation AttachGlobalDocument($orderId: Int!, $docId: Int!) {
createOrderheaderDocument(
    input: {orderheaderDocument: {documentId: $docId, orderheaderId: $orderId}}
  ) {
    clientMutationId
  }
}
`

const AttachDocumentForm = (props) => {

  const existingGlobal = props.existing.filter(obj => obj.global)
  const {
    data,
    loading
  } = useQuery(GET_UNATTACHED_GLOBAL_DOCUMENTS, {
      variables: {existing: existingGlobal.map(item => item.id)}
    }
  )
  const [removeDocument] = useMutation(REMOVE_GLOBAL_DOCUMENT_FROM_ORDER)
  const [attachDocument] = useMutation(ATTACH_GLOBAL_DOCUMENT)
  const selectedOrder = gridSelectionsVar().selectedOrder

  const processDeletions = (id) => {
    removeDocument({
      variables: {orderId: Number(selectedOrder), docId: id}
    }).then(r => console.log(r))
  }
  const processAdditions = (id) => {
    attachDocument({
      variables: {orderId: Number(selectedOrder), docId: id}
    }).then(r => console.log(r))
  }

  const handleSubmit = () => {
    const selected = mutationApiVar().data.map(item => item.id)
    const existing = existingGlobal.map(item => item.id)
    const additions = removeCommon(existing, selected)
    const deletions = removedFromInitial(existing, selected)
    if (deletions.length > 0) {
      deletions.forEach(processDeletions)
    }
    if (additions.length > 0) {
      additions.forEach(processAdditions)
    }
    props.hideModal()
  }

  if (loading) return <CircularProgress/>

  return (
    <>
      <TransferList existing={existingGlobal} options={data.documents.nodes}/>
      <ModalFormButtons label={"SAVE CHANGES"} hideModal={props.hideModal} handleSubmit={handleSubmit}
      />
    </>
  )
};

export default AttachDocumentForm;
