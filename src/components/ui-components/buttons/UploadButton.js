import React from 'react';
import Button from '@mui/material/Button';
import {makeStyles} from '@mui/styles';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const useStyles = makeStyles({
    root: {
      background: 'linear-gradient(#0000cc, #000080)',
      color: 'white',
      borderRadius: 0,

      fontWeight: 600,
      border: '5px solid',
      borderColor: 'white',
      padding: '5px 25px',

      textTransform: 'uppercase',
      '&:hover': {
        background: 'linear-gradient(#000080, #0000cc)',
      },
      '&:disabled': {
        cursor: 'not-allowed',
      },
    },
  })
;

const UploadButton = (props) => {
  const classes = useStyles();

  return (
    <Button
      variant='contained'
      className={classes.root}
      startIcon={<FileUploadIcon/>}
      {...props}
      fullWidth={true}
    >
      {props.label}
    </Button>
  );
};

export default UploadButton;
