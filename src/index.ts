/*
	Prototype: data-rvl-container

	data-rvl-container="[trigger-on-fraction] [block-delay] [item-delay]"
	data-rvl-container="0.25 300ms 50ms"
	data-rvl-container="f25 b300 i50"


	Prototype: data-rvl

	data-rvl="[translate-in-em's] [direction] [order] [delay] [transitionTime]"
	data-rvl="2em left 5 200ms"
	data-rvl="t2 dl o5 dy200 d200"


	Example:

	<div data-rvl-container="f25 b300 i50">
		<img data-rvl="t2 dl o5 dy200" />
	</div>
*/

import { parseContainerParams, parseRevealParams } from "./parsers.js";
import type { Sequence } from "./types.js";

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

	const containers = (container || document).querySelectorAll('[data-rvl-ctn]');
	const sequences = Array.from(containers).map((item): Sequence => ({
		container: item as HTMLElement,
		params: parseContainerParams(item.getAttribute('data-rvl-ctn')),
		items: Array.from(item.querySelectorAll('[data-rvl]')).map(item => ({
			elem: item as HTMLElement,
			params: parseRevealParams(item.getAttribute('data-rvl'))
		}))
	}));

	console.log(sequences)

	//	setup stuff
	sequences.forEach(sequence => sequence.items.forEach(item => {

		const dir = item.params.direction[item.params.direction.length - 1];
		const sign = item.params.direction.length > 1 ? '-' : '';

		item.elem.style.transform = `translate${dir}(${sign}${item.params.translate}em)`;
		item.elem.style.opacity = '0';
		
		if (item.params.transitionDelay) setTimeout(() => {
			item.elem.style.transition = `all ${item.params.transitionDelay}ms ease`;
		}, 50);
	}));

	const revealSequence = async (sequence: Sequence) => {

		await sleep(sequence.params.blockDelay);

		sequence.items.forEach(async (item, index) => {

			const itemDelay = item.params.delay || sequence.params.itemDelay;
			const itemOrder = item.params.order < 2 ? index : item.params.order;
			console.log(itemDelay)
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

};

export default revealScript;
