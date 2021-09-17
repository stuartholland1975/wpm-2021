import { forwardRef, useImperativeHandle, useRef, useState } from "react";

export default forwardRef((props, ref) => {
    const inputRef = useRef();
    const [value, setValue] = useState(props.value);

    function inputHandler(e) {
        if (Number(e.target.value) <= Number(props.data.qtyOs)) {
            setValue(e.target.value);
        } else {
            alert("Qty Done Cannot Exceed Qty Outstanding")
            setValue('')
        }
    }

    useImperativeHandle(ref, () => {
        return {
            getValue: () => {
                return value;
            },
            afterGuiAttached: () => {
                setValue(props.data.qtyOs);
                inputRef.current.focus();
                inputRef.current.select();
            }
        };
    });
    return (
        <input
            type="number"
            className="ag-input-field-input ag-text-field-input"
            ref={inputRef}
            onChange={inputHandler}
            value={value}
        />
    )
})