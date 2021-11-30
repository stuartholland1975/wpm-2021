import React from 'react';
import ApplicationStats from "../application-admin/ApplicationStats";
import {useQuery, gql, useReactiveVar} from "@apollo/client";
import {gridSelectionsVar} from "../../cache";
import {CircularProgress} from "@mui/material";


const GET_APPLICATION_STATS = gql`
query GetCurrentApplication($id: Int!) {
  applicationWithValue(id: $id) {
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
      areaCount
  }
}
`
const ApplicationDetail = () => {

  const selectedApplication = useReactiveVar(gridSelectionsVar).selectedApplication

  const {data, loading} = useQuery(GET_APPLICATION_STATS, {
    variables: {id: selectedApplication}
  })
  if (loading) return <CircularProgress/>
  return (
    <div>
      <ApplicationStats data={data && data.applicationWithValue}/>
    </div>
  );
};

export default ApplicationDetail;