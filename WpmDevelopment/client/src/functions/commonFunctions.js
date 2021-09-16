import { DateTime } from "luxon";
import numeral from "numeral";


export const formatNumberGridNoDecimals = (number) => numeral(number.value).format("0,0");
export const formatNumberGridTwoDecimals = (number) => numeral(number.value).format("0,0.00");

export const formatNumberNoDecimals = (number) => numeral(number).format("0,0");
export const formatNumberTwoDecimals = (number) => numeral(number).format("0,0.00");

export const formatDateGrid = (date) => DateTime.fromISO(date.value).toFormat("dd/LL/y");
export const formatDate = (date) => DateTime.fromISO(date).toFormat("dd/LL/y");

export const formatDateGridText = (date) => DateTime.fromISO(date.value).toLocaleString();
export const formatDateText = (date) => DateTime(date).toFormat("dd/LL/y");


export const parseDateGrid = (date) => DateTime.fromISO(date.value).toLocaleString();




