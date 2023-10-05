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

import attributeParser from "./attributeParser";

import type { RevealItem, ParentRavealElement } from "./types";

const asyncSleep = async (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));

const injectStyles = () => {

	if (typeof document !== 'object') {
		throw new Error('document is inaccessible')
	}

	const styleDirectives = [
		'html, body {overflow-x: hidden}',
		'* {box-sizing: border-box}'
	];

	const style = document.createElement('style');
		style.id = 'reveal-v3-critical-styles';
		style.innerHTML = styleDirectives.join('\n');
	document.head.appendChild(style)
};

export const revealScript = (container?: HTMLElement) => {

	if (!IntersectionObserver) {
		console.warn('IntersectionObserver not supported. Aborting.')
		return false;
	}
	else if (!WeakMap) {
		console.warn('WeakMap not supported. Aborting.')
		return false;
	}

	injectStyles();

	const revealItems = Array.from((container || document).querySelectorAll<HTMLElement>('[data-rvl]')).map(item => {
		const { params, childParams } = attributeParser(item.getAttribute('data-rvl'));
		return { elem: item, params, childParams } as RevealItem;
	});

	revealItems.forEach(async (item) => {
		const dir = item.params.translate.direction.slice(-1);
		const sign = item.params.translate.direction.length > 1 ? '-' : '';

		item.elem.style.transform = `translate${dir}(${sign}${item.params.translate.amountEm}em)`;
		item.elem.style.opacity = '0';
		await asyncSleep(50);
		item.elem.style.transition = `all ${item.params.length}ms ease`;
	});

	const childElements = Array.from(document.querySelectorAll<HTMLElement>('[data-rvl] [data-rvl]'));
	const childItems = revealItems.filter(parent => childElements.some(child => child === parent.elem));
	const parentItems: ParentRavealElement[] = revealItems.filter(parent => !childElements.some(child => child === parent.elem)).map(parent => ({
		elem: parent.elem,
		params: parent.params,
		childParams: parent.childParams,
		children: childItems.filter(child => parent.elem.contains(child.elem))
	}));

	const sequenceMap = new WeakMap(parentItems.map(item => ([item.elem, item])));

	const showElement = async (item: RevealItem) => {
		item.elem.style.transform = '';
		item.elem.style.opacity = '';
		await asyncSleep(item.params.length);
		item.elem.style.transition = '';
	};

	const revealSequence = async (sequence: ParentRavealElement) => {

		sequence.children.forEach(async (item, index) => {
			const itemDelay = item.params.delay || sequence.childParams.delay;
			const itemOrder = item.params.index < 2 ? index : item.params.index;			
			await asyncSleep(itemOrder * itemDelay);
			await showElement(item);
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

export default revealScript;
