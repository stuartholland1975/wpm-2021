import React from 'react';
import Button from '@mui/material/Button';
import {makeStyles} from '@mui/styles';

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(hsl(209, 47%, 40%), hsl(209, 47%, 20%))',
    color: 'white',
    borderRadius: 0,

    fontWeight: 600,
    border: '5px solid',
    borderColor: 'white',
    padding: 2,
    textTransform: 'uppercase',
    '&:hover': {
      background: 'linear-gradient(hsl(209, 47%, 20%), hsl(209, 47%, 40%))',
    },
    '&:disabled': {
      cursor: 'not-allowed',
    },
  },
});

const NavigationButton = (props) => {
  const classes = useStyles();

  return (
    <Button variant='contained' className={classes.root} fullWidth {...props}>
      {props.label}
    </Button>
  );
};

export default NavigationButton;
