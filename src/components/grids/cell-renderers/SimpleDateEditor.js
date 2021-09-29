import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {DateTime} from "luxon";

export default forwardRef((props, ref) => {
  DateTime.now().toISODate();
  const inputRef = useRef();
  const [value, setValue] = useState('');

  const {lastRowDate, currentPeriod} = props

  useEffect(() => {
    if (lastRowDate) {
      setValue(lastRowDate.data.date)
    }
    else setValue(currentPeriod.weekEndingDate)
    inputRef.current.focus();
    inputRef.current.select();
  }, [lastRowDate, currentPeriod])

  function inputHandler(e) {
    setValue(e.target.value.toLocaleString());
  }

  useImperativeHandle(ref, () => {
      return {
        getValue: () => {
          return value;
        },
      }
    }
  )
  ;

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