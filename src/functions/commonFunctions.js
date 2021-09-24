import {DateTime} from "luxon";
import numeral from "numeral";


export const formatNumberGridNoDecimals = (number) => numeral(number.value).format("0,0");
export const formatNumberGridTwoDecimals = (number) => numeral(number.value).format("0,0.00");

export const formatNumberNoDecimals = (number) => numeral(number).format("0,0");
export const formatNumberTwoDecimals = (number) => numeral(number).format("0,0.00");

export const formatDateGrid = (date) => DateTime.fromISO(date.value).toFormat("dd/LL/y");
export const formatDate = (date) => DateTime.fromISO(date).toFormat("dd/LL/y");
export const formatExifDate = date => DateTime.fromFormat(date.slice(0, 10).replace(/:/g, '/'), "y/LL/dd").toFormat("dd/LL/y");

export const formatDateGridText = (date) => DateTime.fromISO(date.value).toLocaleString();
export const formatDateText = (date) => DateTime(date).toFormat("dd/LL/y");


export const parseDateGrid = (date) => DateTime.fromISO(date.value).toLocaleString();

export const removeCommon = (first, second) => {
  const spread = [...first, ...second];
  return spread.filter(el => {
    return (!first.includes(el) && second.includes(el));
  })
};

export const removedFromInitial = (first, second) => {
  const spread = [...first, ...second];
  return spread.filter(el => {
    return (first.includes(el) && !second.includes(el));
  })
}




