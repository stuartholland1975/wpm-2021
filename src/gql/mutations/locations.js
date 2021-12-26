import { gql } from "@apollo/client";


export const CREATE_LOCATION = gql`
mutation CreateLocation($reference: String!, $orderId: Int!) {
  createSitelocation(
    input: { sitelocation: { reference: $reference, orderheaderId: $orderId} }
  ) {
    sitelocation {
      id
      orderheaderId
      reference
      worksheetReference
    }
  }
}
`

export const CREATE_MANY_LOCATIONS = gql`
mutation CreateManyLocations($input: [SitelocationInput]!) {
   sitelocationCreateBulkLocations(
    input: {locations: $input}
  ) {
    clientMutationId
  }
}
`

export const DELETE_LOCATION = gql`
mutation DeleteLocation($id: Int!) {
  deleteSitelocation(input: {id: $id}) {
    deletedSitelocationNodeId
  }
}
`