import type { Direction, RevealItemParams } from "./types.js";

export const parseUnifiedParams = (attribText: string | null): RevealItemParams => {

	const directives = attribText?.toLowerCase()?.split(' ');

	const getArg = (expr: RegExp) => directives.find(item => expr.test(item));

	return {
		threshold: (() => {
			const arg = getArg(/^t\d+$/)?.slice(1);
			return (arg ? parseInt(arg) : 25) / 100;
		})(),
		delay: (() => {
			const arg = getArg(/^d\d+$/)?.slice(1);
			return arg ? parseInt(arg) : 350;
		})(),
		childDelay: (() => {
			const arg = getArg(/^cd\d+$/)?.slice(2);
			return arg ? parseInt(arg) : 50;
		})(),
		translate: (() => {
			const arg = getArg(/^t[rltb]\d*$/);
			const compNumeric = arg?.slice(2);
			return {
				amountEm: compNumeric ? parseInt(compNumeric) : 2,
				direction: {
					't': '-y',
					'b': 'y',
					'l': '-x',
					'r': 'x'
				}[arg[2]] as Direction || 'y'
			};
		})(),
		transitionDelay: (() => {
			const arg = getArg(/^td\d+*$/)?.slice(2);
			return arg ? parseInt(arg) : undefined;
		})(),
		index: (() => {
			const arg = getArg(/^i\d+*$/)?.slice(1);
			return arg ? parseInt(arg) : 1;
		})()
	}
} 

export const parseContainerParams = (attribText: string | null) => {

	const directives = attribText?.toLowerCase();

	return {
		trigger: (() => {
			const arg = directives?.match(/f\d+/)?.[0]?.replace(/\D/g, '');
			return (arg ? parseInt(arg) : 25) / 100;
		})(),
		blockDelay: (() => {
			const arg = directives?.match(/b\d+/)?.[0]?.replace(/\D/g, '');
			return arg ? parseInt(arg) : 350;
		})(),
		itemDelay: (() => {
			const arg = directives?.match(/i\d+/)?.[0]?.replace(/\D/g, '');
			return arg ? parseInt(arg) : 50;
		})()
	}
}

export const parseRevealParams = (attribText: string | null) => {

	const directives = attribText?.toLowerCase();

	return {
		translate: (() => {
			const arg = directives?.match(/t\d+/)?.[0]?.replace(/\D/g, '');
			return arg ? parseInt(arg) : 2;
		})(),
		direction: (() => {
			const arg = directives?.match(/d[rlbt]/)?.[0];
			return arg ? {
				't': '-y',
				'b': 'y',
				'l': '-x',
				'r': 'x'
			}[arg[1]] as Direction : 'y';
		})(),
		transitionDelay: (() => {
			const arg = directives?.match(/tt\d+/)?.[0]?.replace(/\D/g, '');
			return arg ? parseInt(arg) : undefined;
		})(),
		order: (() => {
			const arg = directives?.match(/o\d+/)?.[0]?.replace(/\D/g, '');
			return arg ? parseInt(arg) : 1;
		})(),
		delay: (() => {
			const arg = directives?.match(/d\d+/)?.[0]?.replace(/\D/g, '');
			return arg ? parseInt(arg) : null;
		})()
	}
}
