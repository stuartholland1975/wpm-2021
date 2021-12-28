import { gql } from '@apollo/client'

export const DELETE_ORDERDETAIL = gql`
mutation DeleteOrderdetail($id: Int!) {
  deleteOrderdetail(input: {id: $id}) {
    deletedOrderdetailNodeId
  }
}
`