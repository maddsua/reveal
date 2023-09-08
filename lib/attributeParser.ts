import { Direction, RevealItemOptions } from './types';

const translateDirectionMap: Record<string, Direction> = {
	't': '-y',
	'b': 'y',
	'l': '-x',
	'r': 'x'
};

export default (attribute: string | null): RevealItemOptions => {

	const defaultOptions: RevealItemOptions = {
		params: {
			threshold: 25,
			delay: 125,
			length: 250,
			translate: {
				direction: '-x',
				amountEm: 2
			},
			index: 0
		},
		childParams: {
			threshold: 25,
			delay: 250,
			length: 250,
			translate: {
				direction: '-x',
				amountEm: 2
			},
			index: 0
		}
	};

	const directives = attribute?.toLowerCase()?.split(' ');
	if (!directives?.length) return defaultOptions;

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
		childParams: {
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

	const mergeIfUpdated = (target: object, mutation: object) => {

		for (let prop in mutation) {

			const next = mutation[prop];

			if (typeof next === 'number' && isNaN(next))
				continue;
			else if (typeof next === 'string' && !next?.length)
				continue;
			else if (next === null)
				continue;
			else if (typeof next === 'object' && !Array.isArray(next))
				mergeIfUpdated(target[prop], next);
			else target[prop] = next;
		}
	};

	mergeIfUpdated(defaultOptions.params, providedOptions.params);
	mergeIfUpdated(defaultOptions.childParams, providedOptions.childParams);

	return defaultOptions;
};
