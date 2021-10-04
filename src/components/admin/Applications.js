import React from 'react';
import ApplicationsGrid from "../grids/ApplicationsGrid";
import {gql, useQuery} from "@apollo/client";
import {CircularProgress} from "@mui/material";

const GET_ALL_APPLICATIONS = gql`
query GetAllApplications {
  applicationWithValues {
    totalCount
    nodes {
      applicationCurrent
      applicationDate
      applicationNumber
      applicationOpen
      applicationReference
      applicationSubmitted
      applicationValue
      dateSubmitted
      id
      imageCount
      itemCount
      locationCount
      orderCount
      submissionReference
    }
  }
}

`

const Applications = () => {

  const [gridData, setGridData] = React.useState([])
  const {data, loading} = useQuery(GET_ALL_APPLICATIONS, {
    onCompleted: data => setGridData(data.applicationWithValues.nodes)
  })


  if (loading) return <CircularProgress/>
  return (
    <div>
     
      <ApplicationsGrid data={gridData}/>
    </div>
  );
};

export default Applications;