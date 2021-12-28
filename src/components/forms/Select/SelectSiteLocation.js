import { Controller } from 'react-hook-form';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';

const SelectSiteLocation = ({ control, fieldName, orderLocations, loading }) => {


    if (loading || !orderLocations) return <CircularProgress />


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