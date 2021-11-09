import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { CircularProgress } from '@mui/material';
import CurrentApplication from './CurrentApplication';
import ApplicationProcessingButtons from '../button-bars/ApplicationProcessingButtons';

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

const ApplicationAdmin = () => {

  const { data, loading } = useQuery(GET_CURRENT_APPLICATION, {
    fetchPolicy: 'cache-and-network'
  })

  console.log(data)

  if (loading) return <CircularProgress />


  return (
    <div>
      <br />
      <ApplicationProcessingButtons />
      <CurrentApplication data={data} />
      <hr />
    </div>
  );
};

export default ApplicationAdmin;