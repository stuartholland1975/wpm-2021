import React from 'react';
import NavigateButton from '../ui-components/buttons/NavigationButton';
import { Box } from '@mui/material';
import GlobalDocuments from './GlobalDocuments';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import Periods from './Periods';
import Applications from "./Applications";

function Item(props) {
  const { sx, ...other } = props;
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

const AdminHome = () => {
  const history = useHistory();
  let routeMatch = useLocation();
  return (
    <>
      <Box
        sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', mb: 2 }}
      >
        <Item item>
          <NavigateButton
            label={'GLOBAL DOCUMENTS'}
            fullWidth
            onClick={() => history.push('/admin/global/documents')}
            disabled={routeMatch.pathname.startsWith('/admin/global/documents')}
          />
        </Item>
        <Item item>
          <NavigateButton
            label={'PERIODS'}
            fullWidth
            onClick={() => history.push('/admin/global/periods')}
            disabled={routeMatch.pathname.startsWith('/admin/global/periods')}
          />
        </Item>
        <Item item>
          <NavigateButton label={'APPLICATIONS'} fullWidth onClick={() => history.push('/admin/global/applications')}
            disabled={routeMatch.pathname.startsWith('/admin/global/applications')} />
        </Item>
        <Item item>
          <NavigateButton label={'ACTIVITIES'} fullWidth />
        </Item>
      </Box>
      <br />
      <Switch>
        <Route path={'/admin/global/documents'} exact>
          <GlobalDocuments />
        </Route>
        <Route path={'/admin/global/periods'} exact>
          <Periods />
        </Route>
        <Route path={'/admin/global/applications'} exact>
          <Applications />
        </Route>
      </Switch>
    </>
  );
};

export default AdminHome;
