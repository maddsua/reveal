import type { Direction, RevealItemParams } from "./types.js";

export const parseUnifiedParams = (attribText: string | null): RevealItemParams => {

	const directives = attribText?.toLowerCase()?.split(' ');

	const getArg = (expr: RegExp) => directives.find(item => expr.test(item));

	const arg_threshold = getArg(/^t\d+$/)?.slice(1);
	const arg_delay = getArg(/^d\d+$/)?.slice(1);
	const arg_childDelay = getArg(/^cd\d+$/)?.slice(2);
	const arg_translate = getArg(/^t[rltb]\d*$/);
	const arg_transitionDelay = getArg(/^td\d+*$/)?.slice(2);
	const arg_index = getArg(/^i\d+*$/)?.slice(1);

	const arg_translate_temp = arg_translate?.slice(2);

	return {
		threshold: (arg_threshold ? parseInt(arg_threshold) : 25) / 100,
		delay: arg_delay ? parseInt(arg_delay) : 350,
		childDelay: arg_childDelay ? parseInt(arg_childDelay) : 50,
		translate: {
			amountEm: arg_translate_temp ? parseInt(arg_translate_temp) : 2,
			direction: {
				't': '-y',
				'b': 'y',
				'l': '-x',
				'r': 'x'
			}[arg_translate[2]] as Direction || 'y'
		},
		transitionDelay: arg_transitionDelay ? parseInt(arg_transitionDelay) : undefined,
		index: arg_index ? parseInt(arg_index) : 1
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
