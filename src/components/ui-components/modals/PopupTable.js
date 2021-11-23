/** @format */

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { formatNumberTwoDecimals } from '../../../functions/commonFunctions';

export default function BasicTable({ data }) {
	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 350 }} aria-label='simple table'>
				<TableHead>
					<TableRow>
						<TableCell>Area</TableCell>
						<TableCell align='right'>Value Complete</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data.map((row) => (
						<TableRow
							key={row.area}
							sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
							<TableCell component='th' scope='row'>
								{row.area}
							</TableCell>
							<TableCell align='right'>
								{formatNumberTwoDecimals(row.periodValue)}
							</TableCell>
						</TableRow>
					))}
					<TableRow>
						<TableCell sx={{ fontWeight: 'bold' }}>PERIOD TOTAL</TableCell>
						<TableCell
							align='right'
							component='th'
							scope='row'
							sx={{ fontWeight: 'bold' }}>
							{formatNumberTwoDecimals(
								data
									.map((item) => Number(item.periodValue))
									.reduce((acc, item) => acc + item),
							)}
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
}
