import React from 'react';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import DeleteIcon from '@mui/icons-material/Delete';

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(#b8142d, #730d1c)',
    color: 'white',
    borderRadius: 0,
    padding: '5px 25px',
    fontWeight: 600,
    textTransform: 'uppercase',
    border: '5px solid',
    borderColor: 'white',
    padding: 2,

    '&:hover': {
      background: 'linear-gradient(#730d1c, #b8142d)',
    },
    '&:disabled': {
      cursor: 'not-allowed',
    },
  },
});

const DeleteButton = (props) => {
  const classes = useStyles();

  return (
    <Button
      variant='contained'
      className={classes.root}
      startIcon={<DeleteIcon />}
      fullWidth
      {...props}
    >
      {props.label}
    </Button>
  );
};

export default DeleteButton;
