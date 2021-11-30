import React from 'react';
import NavigationButton from '../ui-components/buttons/NavigationButton';
import { Box } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';

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

const EnquiriesButtons = () => {

    const history = useHistory();
    let routeMatch = useLocation();
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', mb: 2, mt: 1 }}>
            <Item>
                <NavigationButton
                    label='Work orders'
                //  disabled={routeMatch.pathname.startsWith('/orders/admin/locations')}
                //   onClick={() =>
                //        history.push({
                //            pathname: `/orders/admin/locations/${history.location.state}`,
                //           state: history.location.state,
                //       })
                //  }
                />
            </Item>
            <Item>
                <NavigationButton
                    label='applications'
                    disabled={routeMatch.pathname.startsWith('/enquiries/applications')}
                    onClick={() =>
                        history.push({
                            pathname: `/enquiry/applications`,
                            //   state: history.location.state,
                        })
                    }
                />
            </Item>
            <Item>
                <NavigationButton
                    label='spare'
                /*  disabled={routeMatch.pathname.startsWith('/enquiries/applications')}
                 onClick={() =>
                     history.push({
                         pathname: `/enquiry/applications`,
                         //   state: history.location.state,
                     })
                 } */
                />
            </Item>
            <Item>
                <NavigationButton
                    label='spare'
                /*   disabled={routeMatch.pathname.startsWith('/enquiries/applications')}
                  onClick={() =>
                      history.push({
                          pathname: `/enquiry/applications`,
                          //   state: history.location.state,
                      })
                  } */
                />
            </Item>
        </Box>
    );
};

export default EnquiriesButtons;