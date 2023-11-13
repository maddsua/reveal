import { mergeIfUpdated, deepClone } from './objects';
import type { Direction, RevealItemOptions, RevealParams } from './types';

const translateDirectionMap: Record<string, Direction> = {
	't': '-y',
	'b': 'y',
	'l': '-x',
	'r': 'x'
};

export const defaultElementParams: RevealParams = {
	threshold: 25,
	delay: 125,
	length: 250,
	translate: {
		direction: 'x',
		amountEm: 2
	},
	index: 0
};

export default (attribute: string | null): RevealItemOptions => {

	const applyOptions: RevealItemOptions = {
		params: deepClone(defaultElementParams),
		inheritParams: {
			threshold: 0,
			delay: 0,
			length: 0,
			translate: {
				direction: null,
				amountEm: 0
			},
			index: 0
		}
	};

	const directives = attribute?.toLowerCase()?.split(' ');
	if (!directives?.length) return applyOptions;

	const getArg = (expr: RegExp) => directives.find(item => expr.test(item));

	const providedOptions: RevealItemOptions = {
		params: {
			threshold: parseInt(getArg(/^t\d+$/)?.slice(1) as string),
			delay: parseInt(getArg(/^d\d+$/)?.slice(1) as string),
			length: parseInt(getArg(/^l\d+$/)?.slice(1) as string),
			translate: (() => {
				const arg_translate = getArg(/^t[rltb]\d*$/);
				return {
					amountEm: parseInt(arg_translate?.slice(2) as string),
					direction: translateDirectionMap[arg_translate?.[1] || 'b']
				}
			})(),
			index: parseInt(getArg(/^i\d+$/)?.slice(1) as string)
		},
		inheritParams: {
			threshold: parseInt(getArg(/^ct\d+$/)?.slice(2) as string),
			delay: parseInt(getArg(/^cd\d+$/)?.slice(2) as string),
			length: parseInt(getArg(/^cl\d+$/)?.slice(2) as string),
			translate: (() => {
				const arg_translate = getArg(/^ct[rltb]\d*$/);
				return {
					amountEm: parseInt(arg_translate?.slice(3) as string),
					direction: translateDirectionMap[arg_translate?.[2] || 'b']
				}
			})(),
			index: 0
		}
	};

	mergeIfUpdated(applyOptions.params, providedOptions.params);
	mergeIfUpdated(applyOptions.inheritParams, providedOptions.inheritParams);

	return applyOptions;
};
