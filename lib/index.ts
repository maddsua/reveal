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

import { default as attributeParser, defaultElementParams } from "./attributeParser";
import { injectStyles } from "./styles";
import type { RevealItem, ParentRavealElement, Direction, RevealParams } from "./types";

const asyncSleep = async (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));

export const revealInit = (container?: HTMLElement) => {

	if (!IntersectionObserver) {
		console.warn('IntersectionObserver not supported. Aborting.')
		return false;
	}
	else if (!Map) {
		console.warn('WeakMap not supported. Aborting.')
		return false;
	}

	injectStyles();

	const revealItems = Array.from((container || document).querySelectorAll<HTMLElement>('[data-rvl]')).map(item => {
		const { params, inheritParams } = attributeParser(item.getAttribute('data-rvl'));
		return { elem: item, params, inheritParams } as RevealItem;
	});

	const hideElement = async (elem: HTMLElement, trDirect: Direction, trAmount: number, animLen: number) => {
		const dir = trDirect.slice(-1);
		const sign = trDirect.length > 1 ? '-' : '';

		elem.style.transform = `translate${dir}(${sign}${trAmount}em)`;
		elem.style.opacity = '0';
		await asyncSleep(10);
		elem.style.transition = `all ${animLen}ms ease`;
	};

	const childElementsSet = new Set(Array.from(document.querySelectorAll<HTMLElement>('[data-rvl] [data-rvl]')));
	const childItems = revealItems.filter(parent => childElementsSet.has(parent.elem));
	const parentItems: ParentRavealElement[] = revealItems.filter(parent => !childElementsSet.has(parent.elem)).map(parent => ({
		elem: parent.elem,
		params: parent.params,
		inheritParams: parent.inheritParams,
		children: childItems.filter(child => parent.elem.contains(child.elem))
	}));

	parentItems.forEach(parent => {

		const { direction, amountEm } = parent.params.translate;
		hideElement(parent.elem, direction, amountEm, parent.params.length);

		parent.children.forEach(child => {

			const applyParams = Object.fromEntries(Object.keys(defaultElementParams).map(key => ([
				key,
				child.params[key] || parent.inheritParams[key]
			]))) as RevealParams;

			const { direction, amountEm } = applyParams.translate;
			hideElement(child.elem, direction, amountEm, applyParams.length);
		});
	});

	const sequenceMap = new Map(parentItems.map(item => ([item.elem, item])));

	const showElement = async (item: RevealItem) => {
		item.elem.style.transform = '';
		item.elem.style.opacity = '';
		await asyncSleep(item.params.length);
		item.elem.style.transition = '';
	};

	const revealSequence = async (sequence: ParentRavealElement) => {

		sequence.children.forEach(async (child, index) => {
			const childDelay = child.params.delay || sequence.inheritParams.delay;
			const childOrder = child.params.index < 2 ? index : child.params.index;			
			await asyncSleep(childOrder * childDelay);
			await showElement(child);
		});
	};

	const io = new IntersectionObserver(entries => {

		entries.forEach(async (ioEntry) => {

			const sequence = sequenceMap.get(ioEntry.target as HTMLElement) as ParentRavealElement;
			if ((ioEntry.intersectionRatio * 100) < sequence.params.threshold) return;
			
			await asyncSleep(sequence.params.delay);

			revealSequence(sequence);

			await showElement(sequence);

			io.unobserve(ioEntry.target);

		});

	}, { threshold: (Array.apply(0, Array(21)) as any[]).map((_item, index) => index * 0.05) });

	parentItems.forEach(item => io.observe(item.elem));

};

export default revealInit;
