import React, {forwardRef, memo, useEffect, useImperativeHandle, useRef, useState, useCallback} from 'react';

export const TestEditor = memo(forwardRef((props, ref) => {

  const [value, setValue] = useState(props.options[0].displayName);
  const refInput = useRef(null);
  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return value;
      }
    };
  });

  const onChangeListener = useCallback(event => setValue(event.target.value.displayName), []);

  const onKeyDownListener = useCallback(event => {
    console.log(event)
    if (event.key === "ArrowDown") {
      setOpen(true);
    }
  }, []);

  useEffect(() => refInput.current.focus(), []);

  console.log(refInput.current)

  return (
    <select ref={refInput} fullWidth={true} style={{height: 30, width: 190}} value={value} onChange={onChangeListener}
            onKeyDown={onKeyDownListener}>
      {props.options.map(item =>
        <option key={item.id} value={item}> {item.displayName}</option>)}
    </select>
  );
}));