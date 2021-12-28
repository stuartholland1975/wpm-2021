import React from 'react';
import { GET_ALL_WORKTYPES } from '../../../gql/queries/other';
import { useQuery } from '@apollo/client';
import { Controller } from 'react-hook-form';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';

const SelectWorktype = (props) => {

    const { control } = props

    console.log(props);


    const [worktypeOptions, setWorktypeOptions] = React.useState([])
    const { loading } = useQuery(GET_ALL_WORKTYPES, {
        onCompleted: data => setWorktypeOptions(data.worktypes.nodes),
        fetchPolicy: 'cache-and-network'
    })

    if (loading) return <CircularProgress />

    return (
        <Controller
            name="worktypeId"
            control={control}
            rules={{ required: true }}

            render={({ field }) => <Autocomplete {...field}
                isOptionEqualToValue={(option, value) => option?.description === value?.description}
                getOptionLabel={(option) => option?.description}
                options={worktypeOptions}
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




export default SelectWorktype;