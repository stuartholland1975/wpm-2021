import React from 'react';
import NavigationButton from '../ui-components/buttons/NavigationButton';
import { Box } from '@mui/material';
import { useReactiveVar } from '@apollo/client'
import { gridSelectionsVar } from '../../cache';
import ActionButton from '../ui-components/buttons/ActionButton';

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
const ApplicationProcessingButtons = ({ submit }) => {
    const selectedItem = useReactiveVar(gridSelectionsVar).selectedItem
    //   const history = useHistory();
    //  let routeMatch = useLocation();

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', mb: 2 }}>
            <Item>
                <ActionButton
                    label='ADD ITEMS TO APPLICATION'
                    disabled={selectedItem === false}
                    onClick={submit}
                />
            </Item>
            <Item>
                <ActionButton
                    label='SPARE'
                    //   disabled={selectedItem === false}
                    onClick={submit}
                />
            </Item>

        </Box>
    );
};

export default ApplicationProcessingButtons;