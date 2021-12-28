import React from 'react';
import { GET_ALL_AREAS } from '../../../gql/queries/other';
import { useQuery } from '@apollo/client';
import { Controller } from 'react-hook-form';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';

const SelectArea = (props) => {

    const { control } = props

    console.log(props);


    const [areaOptions, setAreaOptions] = React.useState([{ id: 1, description: 'North' }])

    const { loading: areasLoading } = useQuery(GET_ALL_AREAS, {
        onCompleted: data => setAreaOptions(data.areas.nodes),
        fetchPolicy: 'cache-and-network'
    })

    if (areasLoading) return <CircularProgress />

    return (
        <Controller
            name="areaId"
            control={control}
            rules={{ required: true }}

            render={({ field }) => <Autocomplete {...field}
                isOptionEqualToValue={(option, value) => option?.description === value?.description}
                getOptionLabel={(option) => option?.description}
                options={areaOptions}
                onChange={(e, data) => { field.onChange({ id: data.id, description: data.description }) }}
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




export default SelectArea;