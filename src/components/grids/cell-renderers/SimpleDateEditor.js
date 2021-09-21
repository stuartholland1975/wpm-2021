import {forwardRef, useImperativeHandle, useRef, useState} from "react";
import {DateTime} from "luxon";

export default forwardRef((props, ref) => {
    DateTime.now().toISODate();
    const inputRef = useRef();
    const [value, setValue] = useState('');

    function inputHandler(e) {
        setValue(e.target.value.toLocaleString());
    }

    useImperativeHandle(ref, () => {
        return {
            getValue: () => {
                return value;
            },
            afterGuiAttached: () => {
                if (props.lastRowDate) {
                    setValue(props.lastRowDate.data.date)
                } else setValue(props.currentPeriod.weekEndingDate)
                inputRef.current.focus();
                inputRef.current.select();
            }
        };
    });

    return (
        <input
            type="date"
            className="ag-input-field-input ag-text-field-input"
            ref={inputRef}
            onChange={inputHandler}
            value={value}

        />
    )
})