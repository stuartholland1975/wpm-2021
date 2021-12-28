import React from 'react';
import { GET_ALL_ORDERHEADER_STATUSES } from '../../../gql/queries/other';
import { useQuery } from '@apollo/client';
import { Controller } from 'react-hook-form';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';

const SelectStatus = (props) => {

    const { control } = props

    console.log(props);


    const [orderStatusOptions, setOrderStatusOptions] = React.useState([])
    const { loading } = useQuery(GET_ALL_ORDERHEADER_STATUSES, {
        onCompleted: data => setOrderStatusOptions(data.orderheaderStatuses.nodes),
        fetchPolicy: 'cache-and-network'
    })

    if (loading) return <CircularProgress />

    return (
        <Controller
            name="orderStatusId"
            control={control}
            rules={{ required: true }}

            render={({ field }) => <Autocomplete {...field}
                isOptionEqualToValue={(option, value) => option?.statusDescription === value?.statusDescription}
                getOptionLabel={(option) => option?.statusDescription}
                options={orderStatusOptions}
                onChange={(e, data) => { field.onChange({ id: data.id, statusDescription: data.statusDescription }) }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant='filled'
                        label="Area"
                        InputProps={{
                            ...params.InputProps,
                        }}
                    />
                )}
            />}
        />




    )
}




export default SelectStatus;