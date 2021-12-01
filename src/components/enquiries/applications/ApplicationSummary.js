import React from 'react';
import ApplicationStats from "../../application-admin/ApplicationStats";
import {useQuery, gql, useReactiveVar, useLazyQuery} from "@apollo/client";
import {gridSelectionsVar} from "../../../cache";
import {CircularProgress, Grid} from "@mui/material";
import AppByArea from "./AppByArea";
import Box from "@mui/material/Box";


const GET_APPLICATION_STATS = gql`
query GetApplicationStats($id: Int!) {
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


const ApplicationSummary = () => {

  const selectedApplication = useReactiveVar(gridSelectionsVar).selectedApplication

  const {data: appStatsData, loading: appStatsLoading} = useQuery(GET_APPLICATION_STATS, {
    variables: {id: selectedApplication}
  })

  if (appStatsLoading) return <CircularProgress/>
  return (
    <div>
      <ApplicationStats data={appStatsData.applicationWithValue}/>
      <Box m={2}> <Grid container={true}>
        <Grid xs={4}>
          <AppByArea/>
        </Grid>
      </Grid></Box>

    </div>
  );
};

export default ApplicationSummary;