import React from 'react';
import {gql, useQuery, useReactiveVar} from '@apollo/client'
import {CircularProgress} from '@mui/material';
import ApplicationsGrid from '../grids/ApplicationsGrid';
import NavigationButton from '../ui-components/buttons/NavigationButton';
import ActionButton from '../ui-components/buttons/ActionButton';
import {Box} from '@mui/material';
import {Route, Switch, useHistory, useLocation} from 'react-router-dom';
import {gridSelectionsVar} from '../../cache';
import ApplicationDetail from "./ApplicationDetail";

function Item(props) {
  const {sx, ...other} = props;
  return (
    <Box
      sx={{
        textAlign: 'center',
        ...sx,
      }}
      {...other}
    />
  );
}

const GET_ALL_APPLICATIONS = gql`
	query GetAllApplications {
		applicationWithValues {
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
  const history = useHistory()
  const selectedApplication = useReactiveVar(gridSelectionsVar).selectedApplication

  const {loading, data} = useQuery(GET_ALL_APPLICATIONS)

  if (loading) return <CircularProgress/>

  return (
    <div>
      <ApplicationsGrid data={data.applicationWithValues.nodes}/>
      {selectedApplication && <ApplicationDetail/>}
      {/* <Switch>

        <Route path={'/enquiry/applications/:applicationId'} exact>
          <ApplicationDetail/>
        </Route>

      </Switch>*/}
    </div>
  );
};

export default ApplicationEnquiry;