import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Select, MenuItem} from "@mui/material";


export default forwardRef((props, ref) => {
  const inputRef = useRef();
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false);
  const {options, lastRowSupervisor} = props

  const onKeyDownListener = useCallback(event => {
    console.log(event)
    if (event.key === "ArrowDown") {
      setOpen(true)
    }
  }, []);


  useEffect(() => {
    //document.addEventListener('keydown', handleKeyDown);
    // console.log(props)
    inputRef.current.focus()
    if (lastRowSupervisor) {
      setValue(lastRowSupervisor.data.supervisor)
      console.log(lastRowSupervisor.data.supervisor)
    }
    else {
      setValue(
        options[0].displayName
      )
    }

    return () => {
      // document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  /*const handleKeyDown = (event => {
    event.key === "ArrowDown" && setOpen(true);
    event.key === "Tab" && console.log("TAB")
    if (event.key === 'Enter') {
      console.log(event, props)
      props.stopEditing()
    }
  })*/


  const onChangeHandler = useCallback(event => {
    setValue(event.target.value);
  }, []);

  const handleClose = () => {
    setOpen(false);
  }

  const handleOpen = () => {
    setOpen(true);
  };

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return value;
      }
    };
  });

  return (
    <Select
      value={value}
      onChange={onChangeHandler}
      open={open}
      onClose={handleClose}
      fullWidth
      ref={inputRef}
      onKeyDown={onKeyDownListener}
      //  displayEmpty={true}
      //  renderValue={() => value}
      onOpen={handleOpen}
      style={{height: 30}}>
      {props["options"].map(item => <MenuItem key={item.id} value={item.displayName}>{item.displayName}</MenuItem>)}
    </Select>
  );
});
