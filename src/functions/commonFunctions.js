/** @format */

import { DateTime } from 'luxon';
import numeral from 'numeral';

export const formatNumberGridNoDecimals = (number) =>
	numeral(number.value).format('0,0');
export const formatNumberGridTwoDecimals = (number) =>
	numeral(number.value).format('0,0.00');

export const formatNumberNoDecimals = (number) => numeral(number).format('0,0');
export const formatNumberTwoDecimals = (number) =>
	numeral(number).format('0,0.00');

export const formatDateGrid = (date) =>
	DateTime.fromISO(date.value).toFormat('dd/LL/y');
export const formatDate = (date) => DateTime.fromISO(date).toFormat('dd/LL/y');
export const formatExifDate = (date) =>
	DateTime.fromFormat(date.slice(0, 10).replace(/:/g, '/'), 'y/LL/dd').toFormat(
		'dd/LL/y',
	);

export const formatDateGridText = (date) =>
	DateTime.fromISO(date.value).toLocaleString();
export const formatDateText = (date) => DateTime(date).toFormat('dd/LL/y');

export const convertDateToLocal = date => DateTime.fromISO(date.slice(0, 10)).toFormat('dd/LL/y')


export const parseDateGrid = (date) =>
	DateTime.fromISO(date.value).toLocaleString();

export const removeCommon = (first, second) => {
	const spread = [...first, ...second];
	return spread.filter((el) => {
		return !first.includes(el) && second.includes(el);
	});
};

export const removedFromInitial = (first, second) => {
	const spread = [...first, ...second];
	return spread.filter((el) => {
		return first.includes(el) && !second.includes(el);
	});
};

export const numberOnly = (event) => {
	return (
		event.key === '1' ||
		event.key === '2' ||
		event.key === '3' ||
		event.key === '4' ||
		event.key === '5' ||
		event.key === '6' ||
		event.key === '7' ||
		event.key === '8' ||
		event.key === '9' ||
		event.key === '0' ||
		event.key === '.'
	);
};

export const setDelay = (ms) => new Promise((res) => setTimeout(res, ms));

export const textTruncate = (str, length, ending) => {
	if (length == null) {
		length = 100;
	}
	if (ending == null) {
		ending = '...';
	}
	if (str.length > length) {
		return str.substring(0, length - ending.length) + ending;
	} else {
		return str;
	}
};

export const getFirstLetters = (str) => {
	const firstLetters = str
		.split(' ')
		.map((word) => word[0])
		.join('');

	return firstLetters;
};

export const fixKeys = (fn) => (obj) =>
	Object.fromEntries(
		Object.entries(obj).map(([k, v]) => [
			fn(k),
			Array.isArray(v)
				? v.map(fixKeys(fn))
				: typeof v == 'object'
					? fixKeys(fn)(v)
					: v,
		]),
	);

export function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}


export const camelCase = (s) => s.replace(/_(.)/g, (s, c) => c.toUpperCase());

export const snakeCase = (s) => s.replace(/_(.)/g, (s, c) => c.toLowerCase());

export const camelizeKeys = fixKeys(camelCase);

export const SnakeCaseToWords = fixKeys(snakeCase)

export function lowerCase(str) {
	return str.toLowerCase();
}

/**
 * "Safer" String.toUpperCase()
 */
export function upperCase(str) {
	return str.toUpperCase();
}


export function properCase(str) {
	return str.split(' ').map((word) => {
		return word[0].toUpperCase() + word.substring(1);
	}).join(" ");
}

//const words = mySentence.split(" ");

//words.map((word) => {
//	return word[0].toUpperCase() + word.substring(1);
//}).join(" ");

export const formatNumberForExcel = (num) => {
	var m = Number((Math.abs(num) * 100).toPrecision(15));
	return Math.round(m) / 100 * Math.sign(num);
}
