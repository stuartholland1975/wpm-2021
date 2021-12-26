import React from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Controller } from 'react-hook-form';
import { Autocomplete, TextField, CircularProgress, Select, MenuItem, InputLabel } from '@mui/material';
import { GET_ORDER_LOCATIONS } from '../../../gql/queries/locations'
import { gridSelectionsVar } from '../../../cache';

const SelectSiteLocation = ({ control, fieldName, orderLocations, loading }) => {
    const selectedOrder = useReactiveVar(gridSelectionsVar).selectedOrder

    console.log(control)
    if (loading || !orderLocations) return <CircularProgress />
    // if (loading || !orderLocations) return null

    return (
        <Controller
            name={fieldName}
            control={control}
            rules={{ required: true }}
            render={({ field }) => <Autocomplete {...field}
                fullWidth
                isOptionEqualToValue={(option, value) => option?.reference === value?.reference}
                getOptionLabel={(option) => option?.reference}
                options={orderLocations}
                onChange={(e, data) => { field.onChange({ id: data.id, reference: data.reference }) }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant='filled'
                        label="Location"
                    />
                )}
            />}
        />
    )
};

export default SelectSiteLocation;