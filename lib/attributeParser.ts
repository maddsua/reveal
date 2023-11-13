import { filterNullish } from './objects';
import type { Direction, RevealItemOptions, RevealParams, DeepPartial } from './types';

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

export const attributeParser = (attribute: string | null): DeepPartial<RevealItemOptions> => {

	const directives = attribute?.toLowerCase()?.split(' ');
	if (!directives?.length) return {};

	const getArg = (expr: RegExp) => directives.find(item => expr.test(item));

	const getTranslate = (arg: string | undefined) => ({
		amountEm: parseInt(arg?.slice(2) || ''),
		direction: translateDirectionMap[arg?.[1] as string]
	});

	const providedOptions: DeepPartial<RevealItemOptions> = {
		params: {
			threshold: parseInt(getArg(/^t\d+$/)?.slice(1) as string),
			delay: parseInt(getArg(/^d\d+$/)?.slice(1) as string),
			length: parseInt(getArg(/^l\d+$/)?.slice(1) as string),
			translate: getTranslate(getArg(/^t[rltb]\d*$/)),
			index: parseInt(getArg(/^i\d+$/)?.slice(1) as string)
		},
		inheritParams: {
			threshold: parseInt(getArg(/^ct\d+$/)?.slice(2) as string),
			delay: parseInt(getArg(/^cd\d+$/)?.slice(2) as string),
			length: parseInt(getArg(/^cl\d+$/)?.slice(2) as string),
			translate: getTranslate(getArg(/^ct[rltb]\d*$/)),
		}
	};

	return filterNullish(providedOptions);
};

export default attributeParser;
