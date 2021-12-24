import React from 'react';
import { GET_ITEM_TYPES } from '../../../gql/queries/other';
import { useQuery } from '@apollo/client';
import { Controller } from 'react-hook-form';
import { Autocomplete, TextField, CircularProgress, Select, MenuItem, InputLabel } from '@mui/material';

const SelectItemType = (props) => {
    const { control, fieldName } = props

    const [itemtypeOptions, setItemTypeOptions] = React.useState([])

    const { loading } = useQuery(GET_ITEM_TYPES, {
        onCompleted: data => setItemTypeOptions(data.itemTypes.nodes),
        fetchPolicy: 'cache-and-network'
    })

    if (loading) return <CircularProgress />

    return (
        <Controller
            name={fieldName}
            control={control}
            rules={{ required: true }}
            render={({ field }) => <Autocomplete {...field}
                fullWidth
                isOptionEqualToValue={(option, value) => option?.typeShort === value?.typeShort}
                getOptionLabel={(option) => option?.typeShort}
                options={itemtypeOptions}
                onChange={(e, data) => { field.onChange({ id: data.id, typeShort: data.typeShort }) }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant='filled'
                        label="Item Type"
                    />
                )}
            />}
        />




    )
};

export default SelectItemType;