import React from 'react';
import { GET_RATESET_HEADERS, GET_RATESET_PRICES } from '../../../gql/queries/other';
import { useQuery, useLazyQuery } from '@apollo/client';
import { Controller } from 'react-hook-form';
import { Autocomplete, TextField, CircularProgress, Box, MenuItem, InputLabel } from '@mui/material';


const SelectActivityCode = (props) => {

    const { control, fieldNameRH, fieldNameAC } = props
    const [ratesetOptions, setRatesetOptions] = React.useState([])
    const [ratesetPriceOptions, setRatesetPriceOptions] = React.useState([])


    const { loading: ratesetsLoading } = useQuery(GET_RATESET_HEADERS, {
        onCompleted: data => {
            setRatesetOptions(data.ratesetHeaders.nodes);
        },
        fetchPolicy: 'cache-and-network'
    })

    const [getRatesetPrices, { loading: ratesetPricesLoading }] = useLazyQuery(GET_RATESET_PRICES, {
        onCompleted: data => setRatesetPriceOptions(data.pricesWithUplifts.nodes),
        fetchPolicy: 'cache-and-network'
    })



    return (
        < >
            <Controller
                name={fieldNameRH}
                control={control}
                rules={{ required: true }}

                render={({ field }) =>

                    <Autocomplete {...field}
                        fullWidth
                        isOptionEqualToValue={(option, value) => option?.description === value?.description}
                        getOptionLabel={(option) => option?.description}
                        options={ratesetOptions}
                        onChange={(e, data) => getRatesetPrices({ variables: { id: data.id } })}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant='filled'
                                label="RateSet"

                            />
                        )}
                    />
                }
            />
            <Controller
                name={fieldNameAC}
                control={control}
                rules={{ required: true }}

                render={({ field }) => <Autocomplete {...field}
                    fullWidth
                    isOptionEqualToValue={(option, value) => option?.activityCode === value?.activityCode}
                    getOptionLabel={(option) => option?.activityCode}
                    options={ratesetPriceOptions}
                    disabled={ratesetPriceOptions.length === 0}
                    onChange={(e, data) => { field.onChange({ id: data.id, activityCode: data.activityCode }) }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant='filled'
                            label="RateSet"

                        />
                    )}
                />}
            />
        </>
    );
};

export default SelectActivityCode;