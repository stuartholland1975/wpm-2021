/** @format */

import React from 'react';
import { confirmAlert } from 'react-confirm-alert';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	Typography,
	DialogActions,
	Button,
} from '@mui/material';
import PopupTable from './PopupTable';

const ChartTableModal = (data) => {
	confirmAlert({
		customUI: ({ onClose }) => {
			return (
				<div>
					<Dialog
						open={true}
						onClose={onClose}
						aria-labelledby='customized-dialog-title'
						disableEscapeKeyDown
						maxWidth='xs'>
						<DialogTitle id='customized-dialog-title' onClose={onClose}>
							PERIOD NUMBER: {data[0].periodNumber}
						</DialogTitle>
						<DialogContent dividers>
							<PopupTable data={data} />
						</DialogContent>
						<DialogActions>
							<Button autoFocus onClick={onClose}>
								OK
							</Button>
						</DialogActions>
					</Dialog>
				</div>
			);
		},
	});
};

export default ChartTableModal;
