import React, {forwardRef, useImperativeHandle, useState} from "react";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default forwardRef((props, ref) => {
    const [value, setValue] = useState('');
    const [inputValue, setInputValue] = useState('');

    function onChangeHandler(e, value) {
        setValue(value);
    }

    function onInputChangeHandler(e, inputValue) {
        setInputValue(inputValue);
    }

    useImperativeHandle(ref, () => {
        return {
            getValue: () => {
                return value.displayName;
            },
            afterGuiAttached: () => {
                setValue(props.value)
            }
        };
    });

    return (
        <Autocomplete

            options={props.options}
            getOptionLabel={option => option.displayName}
            value={value}
            onChange={onChangeHandler}
            inputValue={inputValue}
            onInputChange={onInputChangeHandler}
            disableClearable
            renderInput={(params) => (
                <TextField
                    {...params}

                    placeholder={'Select ' + props.column.colId} />
            )}
        />
    );
})
