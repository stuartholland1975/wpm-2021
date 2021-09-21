import React from 'react';
import Button from '@mui/material/Button';
import {makeStyles} from '@mui/styles';
import EditIcon from '@mui/icons-material/Edit';

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(hsl(235, 50%, 50%), hsl(235, 94%, 25%))',
    color: 'white',
    borderRadius: 0,

    fontWeight: 600,
    textTransform: 'uppercase',
    border: '5px solid',
    borderColor: 'white',
    padding: 2,

    '&:hover': {
      background: 'linear-gradient(hsl(235, 80%, 25%), hsl(235, 50%, 50%))',
    },
    '&:disabled': {
      cursor: 'not-allowed',
    },
  },
});

const EditButton = (props) => {
  const classes = useStyles();

  return (
    <Button
      variant='contained'
      className={classes.root}
      startIcon={<EditIcon />}
      fullWidth
      {...props}
    >
      {props.label}
    </Button>
  );
};

export default EditButton;
