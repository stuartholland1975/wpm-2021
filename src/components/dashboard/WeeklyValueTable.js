import React from 'react';
import { gql, useQuery } from '@apollo/client'
import { CircularProgress } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { formatNumberTwoDecimals } from '../../functions/commonFunctions'


const GET_AREA_PERIOD_VALUES = gql`
query GetAreaPeriodValues {
 commercialValuesByPeriodAndAreas(orderBy: PERIOD_NUMBER_ASC) {
    nodes {
      admin
      north
      periodNumber
      south
      test
    }
  }
}
`

const WeeklyValueTable = () => {

  const [tableData, setTableData] = React.useState([])

  const { loading } = useQuery(GET_AREA_PERIOD_VALUES, {
    onCompleted: data => {
      setTableData(data.commercialValuesByPeriodAndAreas.nodes)
    }
  })

  if (loading) return <CircularProgress />

  return (
    <TableContainer component={Paper} sx={{ borderStyle: 'solid', borderWidth: '1px', background: "#f2f2f2" }}>
      <h3 style={{ textDecoration: 'underline' }}>VALUE COMPLETE BY PERIOD AND AREA</h3>
      <Table aria-label='simple table'>

        <TableHead>
          <TableRow>
            <TableCell>Period Number</TableCell>
            <TableCell align='right'>Admin</TableCell>
            <TableCell align='right'>North</TableCell>
            <TableCell align='right'>South</TableCell>
            <TableCell align='right'>Test</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map(item => <TableRow key={item.periodNumber}>
            <TableCell>
              {item.periodNumber}
            </TableCell>
            <TableCell align='right'>
              {formatNumberTwoDecimals(item.admin)}
            </TableCell>
            <TableCell align='right'>
              {formatNumberTwoDecimals(item.north)}
            </TableCell>
            <TableCell align='right'>
              {formatNumberTwoDecimals(item.south)}
            </TableCell>
            <TableCell align='right'>
              {formatNumberTwoDecimals(item.test)}
            </TableCell>
          </TableRow>)}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WeeklyValueTable;