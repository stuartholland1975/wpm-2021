import React from 'react';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
	root: {
		background: 'linear-gradient(#862d59, #391427)',
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
});

const ActionButton = (props) => {
	const classes = useStyles();

	return (
		<Button variant='contained' className={classes.root} fullWidth={true} {...props}>
			{props.label}
		</Button>
	);
};

export default ActionButton;
