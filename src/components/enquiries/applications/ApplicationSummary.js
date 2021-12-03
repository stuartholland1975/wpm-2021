import React from 'react';
import ApplicationStats from "../../application-admin/ApplicationStats";
import {useQuery, gql, useReactiveVar} from "@apollo/client";
import {gridSelectionsVar} from "../../../cache";
import {CircularProgress, Grid} from "@mui/material";
import AreaByApp from "./AreaByApp";
import Box from "@mui/material/Box";
import OrdersByApp from "./OrdersByApp";

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

	const selectedApplication = useReactiveVar (gridSelectionsVar).selectedApplication

	const {data: appStatsData, loading: appStatsLoading} = useQuery (GET_APPLICATION_STATS, {
		variables: {id: selectedApplication}
	})

	if ( appStatsLoading ) return <CircularProgress/>
	return (
		<div>
			<ApplicationStats data={appStatsData.applicationWithValue}/>
			<Box m={2}> <Grid container={true} spacing={2}>
				<Grid item xs={6}>
					<AreaByApp/>
				</Grid>
				<Grid item xs={6}>
					<OrdersByApp/>
				</Grid>
			</Grid></Box>
		</div>
	);
};

export default ApplicationSummary;