import React from 'react';
import Button from '@mui/material/Button';
import {makeStyles} from '@mui/styles';

const useStyles = makeStyles ({
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

const GridActionButton = (props) => {
	const classes = useStyles ();

	return (
		<Button
			variant='contained'
			className={classes.root}
			{...props}
			fullWidth={true}
			size={'small'}
		>
			{props.label}
		</Button>
	);
};

export default GridActionButton;
