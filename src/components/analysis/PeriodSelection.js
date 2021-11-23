import React from 'react';
import {gql, useQuery} from '@apollo/client'
import {TextField, Grid, Autocomplete, CircularProgress} from '@mui/material';

const GET_PERIODS = gql`
query GetPeriods {
   periods(filter: {worksValue: {greaterThan: "0"}}) {
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

const PeriodSelection = ({getData}) => {

  const [periodOptions, setPeriodOptions] = React.useState([])


  const {loading} = useQuery(GET_PERIODS, {
    onCompleted: data => setPeriodOptions(data.periods.nodes)
  })

  function handleGetData(value) {
    value && getData({
      variables: {period: value.periodNumber}
    })
  }

  if (loading) return <CircularProgress/>
  return (
    <div>
      <Grid container ml={1} mr={1} mt={3}>
        <Grid item xs={1.5}>

          <Autocomplete
            sx={{m: 1}}
            size="small"
            disableClearable
            getOptionLabel={(option) => `PERIOD NUMBER :  ${option.periodNumber}`}
            options={periodOptions}
            onChange={(_event, newValue) => handleGetData(newValue)}
            isOptionEqualToValue={(option, value) => option.periodNumber === value.periodNumber}
            renderInput={(params) => (
              <TextField
                {...params}
                //  variant='filled'
                label="Period Number"
                InputProps={{
                  ...params.InputProps,

                }}
              />
            )}/>
        </Grid>


      </Grid>
    </div>
  );
};

export default PeriodSelection;