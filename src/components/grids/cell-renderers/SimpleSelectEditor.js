import React, {
    useState,
    forwardRef,
    useImperativeHandle,
    useRef
} from 'react';
import { MenuItem, Select } from '@material-ui/core';

export default forwardRef((props, ref) => {
    const [value, setValue] = useState('');
    const [open, setOpen] = useState(false);
    const inputRef = useRef();

    React.useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    function handleKeyDown(e) { e.key === "ArrowDown" && setOpen(true); }

    function onChangeHandler(e, value) {
        setValue(e.target.value);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
        // setValue()
    };


    useImperativeHandle(ref, () => {

        return {
            getValue: () => {
                return value.displayName;
            },

            afterGuiAttached: () => {
                //  setOpen(true);
                if (props.lastRowSupervisor) {
                    const previousOption = props.options.filter(obj => obj.displayName === props.lastRowSupervisor.data.supervisor)[0]
                    setValue(previousOption)
                } else setValue(props.options[0])
            },
        };
    });

    return (
        <Select
            value={value}
            onChange={onChangeHandler}
            ref={inputRef}
            fullWidth
            open={open}
            style={{ height: 30 }}
            displayEmpty={true}
            renderValue={() => value.displayName}
            onClose={handleClose}
            onOpen={handleOpen}>
            {props.options.map((item) => (
                <MenuItem key={item.id} value={item} >
                    {item.displayName}
                </MenuItem>
            ))}
        </Select>
    );
});
