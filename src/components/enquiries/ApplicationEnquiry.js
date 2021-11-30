import React from 'react';
import {gql, useQuery, useReactiveVar} from '@apollo/client'
import {CircularProgress} from '@mui/material';
import ApplicationsGrid from '../grids/ApplicationsGrid';
import NavigationButton from '../ui-components/buttons/NavigationButton';
import ActionButton from '../ui-components/buttons/ActionButton';
import {Box} from '@mui/material';
import {useHistory, useLocation} from 'react-router-dom';
import {gridSelectionsVar} from '../../cache';

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
      <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', mb: 2, mt: 1}}>


        <Item>
          <ActionButton
            label='view application Detail'
            disabled={selectedApplication === false}
            onClick={() =>
              history.push({
                pathname: `/enquiry/applications/${selectedApplication}`
              })
            }
          />
        </Item>
        <Item>
          <NavigationButton
            label='spare'
            //  disabled={routeMatch.pathname.startsWith('/enquiries/applications')}
            /*   onClick={() =>
                  history.push({
                      pathname: `/enquiries/applications`,
                      //   state: history.location.state,
                  })
              } */
          />
        </Item>
        <Item>
          <NavigationButton
            label='spare'
            //  disabled={routeMatch.pathname.startsWith('/enquiries/applications')}
            /*   onClick={() =>
                  history.push({
                      pathname: `/enquiries/applications`,
                      //   state: history.location.state,
                  })
              } */
          />
        </Item>
        <Item>
          <NavigationButton
            label='spare'
            //  disabled={routeMatch.pathname.startsWith('/enquiries/applications')}
            /*   onClick={() =>
                  history.push({
                      pathname: `/enquiries/applications`,
                      //   state: history.location.state,
                  })
              } */
          />
        </Item>
      </Box>
      <ApplicationsGrid data={data.applicationWithValues.nodes}/>
    </div>
  );
};

export default ApplicationEnquiry;