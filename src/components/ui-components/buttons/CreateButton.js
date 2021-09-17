import React from 'react';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(#015b5b, #052e2e)',
    color: 'white',
    borderRadius: 0,

    fontWeight: 600,
    textTransform: 'uppercase',
    border: '5px solid',
    borderColor: 'white',
    padding: 2,

    '&:hover': {
      background: 'linear-gradient(#052e2e, #015b5b)',
    },
    '&:disabled': {
      cursor: 'not-allowed',
    },
  },
});

const CreateButton = (props) => {
  const classes = useStyles();

  return (
    <Button
      variant='contained'
      className={classes.root}
      startIcon={<AddIcon />}
      fullWidth
      {...props}
    >
      {props.label}
    </Button>
  );
};

export default CreateButton;
