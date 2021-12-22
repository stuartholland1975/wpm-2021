< Autocomplete
    id="select-area"
    {...field}

    options={areaOptions}

    isOptionEqualToValue={(option, value) => option.description === value.description}
    getOptionLabel={(option) => option.description}
    loading={areasLoading}
    renderInput={(params) => (
        <TextField
            {...params}
            variant='filled'
            label="Area"
            required
            InputProps={{
                ...params.InputProps,
                endAdornment: (
                    <React.Fragment>
                        {areasLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                    </React.Fragment>
                ),
            }}
        />