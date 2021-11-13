import React from 'react';
import { useQuery, gql, useMutation, useReactiveVar } from '@apollo/client';
import { CircularProgress, Grid } from '@mui/material';
import CurrentApplication from './CurrentApplication';
import ApplicationProcessingButtons from '../button-bars/ApplicationProcessingButtons';
import AvailableOrdersList from '../grids/AvailableOrdersList';
import AvailableLocationsList from '../grids/AvailableLocationsList';
import AvailableItemsList from '../grids/AvailableItemsList';
import { selectedWorksheetsVar, gridSelectionsVar } from '../../cache';
import { confirmAlert } from 'react-confirm-alert';
import { formatNumberTwoDecimals } from '../../functions/commonFunctions'


const GET_CURRENT_APPLICATION = gql`
query GetCurrentApplication {
  applicationWithValues(condition: { applicationCurrent: true }) {
    nodes {
      id
      applicationReference
      applicationCurrent
      applicationDate
      applicationNumber
      applicationOpen
      applicationSubmitted
      applicationValue
      dateSubmitted
      imageCount
      itemCount
      locationCount
      orderCount
      submissionReference
    }
  }
}
`
const GET_DATA_AVAILABLE_FOR_APPLICATION = gql`
query GetDataAvailableForApplication {
  wpmGraphqlGetOrdersAvailableForApplication {
    nodes {
      area
      id
      orderNumber
      projectTitle
      statusDescription
      workType
      orderValueTotalApplied
      orderValueTotalComplete
      imageCount
    }
  }
  wpmGraphqlGetLocationsAvailableForApplication {
    nodes {
     id
      orderheaderId
      reference
      worksheetReference
      imageCount
      valueApplied
      valueComplete
    }
  }
  wpmGraphqlGetItemsAvailableForApplication {
    nodes {
      id
      itemNumber
      orderNumber
      orderheaderId
      projectTitle
      worksheetReference
      sitelocationId
      valueComplete
      valueApplied
      activityCode
      activityDescription
      qtyComplete
      qtyApplied
    }
  }
  wpmGraphqlGetWorksheetsAvailableForApplication {
    nodes {
      id
      itemNumber
      applied
      qtyComplete
      valueComplete
      worksheetReference
      orderdetailId
      
    }
  }
}
`
const ADD_WORKSHEETS_TO_APPLICATION = gql`
mutation AddWorksheetsToApplication($id: [Int!]) {
  addWorksheetsToApplication(input: {worksheetId:$id}) {
    clientMutationId
  }
}
`
const ApplicationAdmin = () => {

  const [availableOrders, setAvailableOrders] = React.useState([])
  const [availableLocations, setAvailableLocations] = React.useState([])
  const [availableItems, setAvailableItems] = React.useState([])
  const worksheets = useReactiveVar(selectedWorksheetsVar)

  const { data, loading } = useQuery(GET_CURRENT_APPLICATION, {
    fetchPolicy: 'cache-and-network'
  })

  const { refetch } = useQuery(GET_DATA_AVAILABLE_FOR_APPLICATION, {
    fetchPolicy: 'cache-and-network',
    onCompleted: data => {
      const orderData = data.wpmGraphqlGetOrdersAvailableForApplication.nodes
      const orderGridData = orderData.map(item => ({
        ...item,
        locationCount: data.wpmGraphqlGetLocationsAvailableForApplication.nodes.filter(obj => obj.orderheaderId === item.id).length
      }))
      setAvailableOrders(orderGridData)
      const locationData = data.wpmGraphqlGetLocationsAvailableForApplication.nodes
      const locationGridData = locationData.map(item => ({
        ...item,
        itemCount: data.wpmGraphqlGetItemsAvailableForApplication.nodes.filter(obj => obj.sitelocationId === item.id).length
      }))
      setAvailableLocations(locationGridData)
      const itemData = data.wpmGraphqlGetItemsAvailableForApplication.nodes
      const itemGridData = itemData.map(item => ({
        ...item,
        worksheetCount: data.wpmGraphqlGetWorksheetsAvailableForApplication.nodes.filter(obj => obj.orderdetailId === item.id).length,
        worksheetId: data.wpmGraphqlGetWorksheetsAvailableForApplication.nodes.filter(obj => obj.orderdetailId === item.id).map(item => item.id)
      }))

      setAvailableItems(itemGridData)
    }
  })

  const [processWorksheets] = useMutation(ADD_WORKSHEETS_TO_APPLICATION, {
    refetchQueries: [
      { query: GET_DATA_AVAILABLE_FOR_APPLICATION },
      { query: GET_CURRENT_APPLICATION }
    ],

    awaitRefetchQueries: true,
    onCompleted: data => refetch()
  })

  const processData = () => {
    if (worksheets.length > 0) {
      confirmAlert({
        title: 'Confirm Submission',
        message: 'SUBMISSION VALUE IS ' + formatNumberTwoDecimals(gridSelectionsVar().worksheetsValue),
        buttons: [
          {
            label: 'SUBMIT',
            onClick: () =>
              processWorksheets({
                variables: {
                  id: worksheets
                },
              }),
          },
          {
            label: 'CANCEL',
          },
        ],
      });
    }
    console.log(worksheets)
  }

  if (loading) return <CircularProgress />

  return (
    <div>
      <br />
      <ApplicationProcessingButtons submit={processData} />
      <CurrentApplication data={data} />
      <hr />
      <Grid container spacing={2} >
        <Grid item xs={6} >
          <AvailableOrdersList data={availableOrders} />
          <AvailableLocationsList data={availableLocations} />
        </Grid>

        <Grid item xs={6} >
          <AvailableItemsList data={availableItems} />
        </Grid>
      </Grid>
    </div>
  );
};

export default ApplicationAdmin;