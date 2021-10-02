import {forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {numberOnly} from "../../../functions/commonFunctions";

export default forwardRef((props, ref) => {
  const inputRef = useRef();
  const {qtyOs} = props.data
  const [value, setValue] = useState(qtyOs)


  const onChangeListener = useCallback(event => {
    if (Number(event.target.value) > Number(qtyOs)) {
      alert('Qty Done Cannot Exceed Qty Outstanding');
      setValue(value);
    }
    else {
      setValue(event.target.value);
    }
  }, [value, qtyOs]);


  const onKeyPressListener = useCallback(event => {
    if (!numberOnly(event.nativeEvent)) {
      console.log(numberOnly(event))
      event.preventDefault();
    }
  }, []);

  useEffect(() => {
    inputRef.current.focus()
    inputRef.current.select()
  }, [])

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return value;
      }
    };
  });

  return (
    <input
      className='ag-input-field-input ag-text-field-input'
      ref={inputRef}
      onChange={onChangeListener}
      value={value}
      onKeyPress={onKeyPressListener}
    />
  );
});
