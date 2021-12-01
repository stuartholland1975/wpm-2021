import React from 'react';
import {gql, useQuery, useReactiveVar} from '@apollo/client'
import {CircularProgress, Box} from '@mui/material';
import ApplicationsGrid from '../../grids/ApplicationsGrid';
import {gridSelectionsVar} from '../../../cache';
import ApplicationSummary from "./ApplicationSummary";


const GET_ALL_APPLICATIONS = gql`
	query GetAllApplications {
		applicationWithValues(orderBy: APPLICATION_NUMBER_DESC) {
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
`;

const ApplicationEnquiry = () => {
  const selectedApplication = useReactiveVar(gridSelectionsVar).selectedApplication
  const {loading, data} = useQuery(GET_ALL_APPLICATIONS)

  React.useEffect(() => {
    return () => gridSelectionsVar({
      ...gridSelectionsVar(),
      selectedApplication: false
    })
  }, [])

  if (loading) return <CircularProgress/>

  return (
    <Box sx={{mt: 2}}>
      <ApplicationsGrid data={data.applicationWithValues.nodes} pageSize={5}/>
      {selectedApplication &&
      <>
        <hr/>
        <ApplicationSummary/>
      </>
      }
    </Box>
  );
};

export default ApplicationEnquiry;