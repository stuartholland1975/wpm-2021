import React from 'react';
import { gql, useQuery } from '@apollo/client'
import { TextField, Grid, Autocomplete, CircularProgress } from '@mui/material';

const GET_PERIODS = gql`
query GetPeriods {
   periods(filter: {worksValue: {greaterThan: "0"}}orderBy: PERIOD_NUMBER_DESC) {
    nodes {
      id
      week
      year
      weekCommencingDate
      weekEndingDate
      periodNumber
      worksValue
    }
  }
}
`

const PeriodSelection = ({ getData }) => {

  const [periodOptions, setPeriodOptions] = React.useState([])


  const { loading } = useQuery(GET_PERIODS, {
    onCompleted: data => setPeriodOptions(data.periods.nodes),
    fetchPolicy: 'network-only'
  })

  function handleGetData(value) {
    value && getData({
      variables: { period: value.periodNumber }
    })
  }

  if (loading) return <CircularProgress />
  return (
    <div>
      <Grid container >
        <Grid item xs={2}>
          <Autocomplete
            size="small"
            disableClearable
            getOptionLabel={(option) => `PERIOD NUMBER :  ${option.periodNumber}`}
            options={periodOptions}
            onChange={(_event, newValue) => handleGetData(newValue)}
            isOptionEqualToValue={(option, value) => option.periodNumber === value.periodNumber}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='filled'
                label="Period Number"
                InputProps={{
                  ...params.InputProps,

                }}
              />
            )} />
        </Grid>
      </Grid>
    </div>
  );
};

export default PeriodSelection;