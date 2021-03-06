import React from 'react';
import Button from '@mui/material/Button';
import {makeStyles} from '@mui/styles';

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(hsl(0, 0%, 80%), hsl(0, 0%, 25%))',
    color: 'white',
    borderRadius: 0,

    fontWeight: 600,
    border: '5px solid',
    borderColor: 'white',
    padding: 2,

    textTransform: 'uppercase',
    '&:hover': {
      background: 'linear-gradient(hsl(0, 0%, 25%), hsl(10, 0%, 80%))',
    },
    '&:disabled': {
      cursor: 'not-allowed',
    },
  },
});

const CancelButton = (props) => {
  const classes = useStyles();

  return (
    <Button
      variant='contained'
      className={classes.root}
     // startIcon={<ToggleOffIcon />}
      {...props}
      fullWidth
    >
      {props.label}
    </Button>
  );
};

export default CancelButton;
