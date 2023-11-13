/*
	Prototype: data-rvl-container

	data-rvl-container="[trigger-on-fraction] [block-delay] [item-delay]"
	data-rvl-container="0.25 300ms 50ms"
	data-rvl-container="f25 b300 i50"


	Prototype: data-rvl

	data-rvl="[translate-in-em's] [direction] [order] [delay] [transitionTime]"
	data-rvl="2em left 5 200ms"
	data-rvl="t2 dl o5 dy200 tt200"


	Example:

	<div data-rvl-container="f25 b300 i50">
		<img data-rvl="t2 dl o5 d200" />
	</div>
*/

import { AttributeParser, defaultElementParams } from "./attributeParser";
import { mergeNonNullish } from "./objects";
import { injectStyles } from "./styles";
import type { Translate, RevealElement, RevealParentElement } from "./types";

const asyncSleep = async (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));

export const revealInit = (container?: HTMLElement) => {

	//	test some required apis
	if (!IntersectionObserver) {
		console.warn('IntersectionObserver not supported. Aborting.')
		return false;
	}
	else if (!Map) {
		console.warn('WeakMap not supported. Aborting.')
		return false;
	}

	//	styles go here
	injectStyles();

	//	find all reveal candidates
	const revealItems = Array.from((container || document).querySelectorAll<HTMLElement>('[data-rvl]')).map(item => ({
		element: item,
		attributeParser: new AttributeParser(item.getAttribute('data-rvl'))
	}));

	//	sort 'em into parents and children
	const childElementsSet = new Set(Array.from(document.querySelectorAll<HTMLElement>('[data-rvl] [data-rvl]')));
	const childrenItems = revealItems.filter(item => childElementsSet.has(item.element));
	const parentItems = revealItems.filter(item => !childElementsSet.has(item.element)).map(item => {

		const params = mergeNonNullish(defaultElementParams, item.attributeParser.parse());

		const inheritParams = mergeNonNullish(defaultElementParams, item.attributeParser.parseChildren());
		const children = childrenItems.map(item => ({
			elem: item.element,
			params: mergeNonNullish(inheritParams, item.attributeParser.parse())
		}));

		return {
			elem: item.element,
			params,
			inheritParams,
			children
		};
	});

	console.log(parentItems);

	//	self explanatory
	const hideElement = async (elem: HTMLElement, translate: Translate, animLen: number) => {

		const dir = translate.direction.slice(-1);
		const sign = translate.direction.length > 1 ? '-' : '';

		elem.style.transform = `translate${dir}(${sign}${translate.amountEm}em)`;
		elem.style.opacity = '0';
		await asyncSleep(10);
		elem.style.transition = `all ${animLen}ms ease`;
	};

	parentItems.forEach(item => {
		hideElement(item.elem, item.params.translate, item.params.length);
		item.children.forEach(child => {
			hideElement(child.elem, child.params.translate, child.params.length);
		});
	});

	const showElement = async (item: RevealElement) => {
		item.elem.style.transform = '';
		item.elem.style.opacity = '';
		await asyncSleep(item.params.length);
		item.elem.style.transition = '';
	};

	const revealSequence = async (sequence: RevealParentElement) => {
		sequence.children.forEach(async (child, index) => {
			const childDelay = child.params.delay || sequence.inheritParams.delay || defaultElementParams.delay;
			const childOrder = child.params.index < 2 ? index : child.params.index || 0;
			await asyncSleep(childOrder * childDelay);
			await showElement(child);
		});
	};

	const sequenceMap = new Map(parentItems.map(item => ([item.elem, item])));
	const io = new IntersectionObserver(entries => {

		entries.forEach(async (ioEntry) => {

			const sequence = sequenceMap.get(ioEntry.target as HTMLElement) as RevealParentElement;
			if ((ioEntry.intersectionRatio * 100) < sequence.params.threshold) return;
			
			await asyncSleep(sequence.params.delay || defaultElementParams.delay);
			revealSequence(sequence);

			await showElement(sequence);
			io.unobserve(ioEntry.target);
		});

	}, { threshold: (Array.apply(0, Array(21)) as any[]).map((_item, index) => index * 0.05) });

	parentItems.forEach(item => io.observe(item.elem));

};

export default revealInit;
