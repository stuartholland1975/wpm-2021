import React from 'react';
import NavigateButton from '../ui-components/buttons/NavigationButton'
import {Box} from "@mui/material";
import GlobalDocuments from "./GlobalDocuments";
import {Route, Switch, useHistory} from "react-router-dom";
import Periods from "./Periods";

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

const AdminHome = () => {
  const history = useHistory()
  return (
    <>
      <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', mb: 2}}>
        <Item item>
          <NavigateButton label={"GLOBAL DOCUMENTS"} fullWidth onClick={() => history.push("/admin/global/documents")}/>
        </Item>
        <Item item>
          <NavigateButton label={"PERIODS"} fullWidth onClick={() => history.push("/admin/global/periods")}/>
        </Item>
        <Item item>
          <NavigateButton label={"SPARE ADMINISTRATION"} fullWidth/>
        </Item>
        <Item item>
          <NavigateButton label={"SPARE ADMINISTRATION"} fullWidth/>
        </Item>
      </Box>
      <br/>
      <Switch>
        <Route path={"/admin/global/documents"} exact>
          <GlobalDocuments/>
        </Route>
        <Route path={"/admin/global/periods"} exact>
          <Periods/>
        </Route>
      </Switch>
    </>
  );
};

export default AdminHome;