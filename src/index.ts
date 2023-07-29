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

import { parseUnifiedParams } from "./parsers.js";
import type { RevealItemParams, Sequence } from "./types.js";

const sleep = async (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));

export const revealScript = (container?: HTMLElement) => {

	if (!IntersectionObserver) {
		console.warn('IntersectionObserver not supported. Aborting.')
		return false;
	}
	else if (!WeakMap) {
		console.warn('WeakMap not supported. Aborting.')
		return false;
	}

	const revealItems = Array.from((container || document).querySelectorAll<HTMLElement>('[data-rvl]')).map(item => ({
		element: item as HTMLElement,
		params: parseUnifiedParams(item.getAttribute('data-rvl')),
	}));

	const containers = revealItems.filter(item => typeof item.params.threshold === 'number').map(item => Object.assign(item, {
		items: revealItems.filter(item1 => item.element.contains(item1.element))
	}));

	console.log(containers);

	const hideElement = (element: HTMLElement, params: RevealItemParams) => {
		
		const dir = params.translate.direction.slice(-1);
		const sign = params.translate.direction.length > 1 ? '-' : '';

		element.style.transform = `translate${dir}(${sign}${params.translate.amountEm}em)`;
		element.style.opacity = '0';
		
		if (params.transitionDelay) setTimeout(() => {
			element.style.transition = `all ${params.transitionDelay}ms ease`;
		}, 50);
	};

	containers.forEach(item => {
		if (!item.items.length)
			hideElement(item.element, item.params);
		item.items?.forEach(item1 => hideElement(item1.element, item1.params));
	});




/*	

	const revealSequence = async (sequence: Sequence) => {

		await sleep(sequence.params.blockDelay);

		sequence.items.forEach(async (item, index) => {

			const itemDelay = item.params.delay || sequence.params.itemDelay;
			const itemOrder = item.params.order < 2 ? index : item.params.order;

			await sleep(itemOrder * itemDelay);
			item.elem.style.transform = null;
			item.elem.style.opacity = null;

			await sleep(item.params.transitionDelay || 250);
			item.elem.style.transition = null;
		});
	};
	
	const sequenceMap = new WeakMap(sequences.map(item => ([item.container, item])));

	const io = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			const sequence = sequenceMap.get(entry.target as HTMLElement) as Sequence;
			if (entry.intersectionRatio < sequence.params.trigger) return;
			revealSequence(sequence);
			io.unobserve(entry.target);
		});
	}, { threshold: (Array.apply(0, Array(21)) as any[]).map((_item, index) => index * 0.05) });

	sequences.forEach(sequence => io.observe(sequence.container));

	const styleDirectives = [
		'html, body {overflow-x: hidden}',
		'[data-rvl] { transition: all 250ms ease }'
	];

	const style = document.createElement('style');
		style.id = 'reveral-v2-critical-styles';
		style.innerHTML = styleDirectives.join('\n');
	setTimeout(() => document.head.appendChild(style), 50);*/
};

export default revealScript;
