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

const asyncSleep = async (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));

const injectStyles = () => {

	if (typeof document !== 'object') {
		throw new Error('document is inaccessible')
	}

	const styleDirectives = [
		'html, body {overflow-x: hidden}',
		'* {box-sizing: border-box}',
		'[data-rvl][data-role=container] {overflow: hidden}'
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
		return {
			elem: item,
			params,
			childParams
		};
	});

	revealItems.forEach(async (item) => {
		const dir = item.params.translate.direction.slice(-1);
		const sign = item.params.translate.direction.length > 1 ? '-' : '';

		item.elem.style.transform = `translate${dir}(${sign}${item.params.translate.amountEm}em)`;
		item.elem.style.opacity = '0';
		await asyncSleep(50);
		item.elem.style.transition = `all ${item.params.length}ms ease`;
	})

/*
	const containers = revealItems.filter(item => typeof item.params.threshold === 'number').map(item => Object.assign(item, {
		items: revealItems.filter(item1 => item.elem.contains(item1.elem)).filter(item1 => item.elem != item1.elem)
	})) as RevealContainer[];

	console.log(containers);

	const hideElement = async (elem: HTMLElement, params: RevealItemParams) => {
		
		const dir = params.translate.direction.slice(-1);
		const sign = params.translate.direction.length > 1 ? '-' : '';

		elem.style.transform = `translate${dir}(${sign}${params.translate.amountEm}em)`;
		elem.style.opacity = '0';
		await asyncSleep(50);
		elem.style.transition = `all ${params.length}ms ease`;
	};

	const showElement = async (elem: HTMLElement, params: RevealItemParams) => {
		elem.style.transform = null;
		elem.style.opacity = null;
		await asyncSleep(params.length);
		elem.style.transition = null;
	};

	containers.forEach(async (item) => {
		if (!item.items.length)
			hideElement(item.elem, item.params);
		item.elem.setAttribute('data-role', 'container')
		item.items?.forEach(item1 => hideElement(item1.elem, item1.params));
	});

	const revealSequence = async (sequence: RevealContainer) => {

		await asyncSleep(sequence.params.delay);

		sequence.items.forEach(async (item, index) => {
			const itemDelay = item.params.delay || sequence.params.childDelay;
			const itemOrder = item.params.index < 2 ? index : item.params.index;			
			await asyncSleep(itemOrder * itemDelay);
			await showElement(item.elem, item.params);
		});
	};

	const sequenceMap = new WeakMap(containers.map(item => ([item.elem, item])));

	const io = new IntersectionObserver(entries => {
		entries.forEach(async (entry) => {
			const sequence = sequenceMap.get(entry.target as HTMLElement);
			if (entry.intersectionRatio < sequence.params.threshold) return;
			await asyncSleep(sequence.params.delay);
			sequence.items.length ? revealSequence(sequence) : showElement(sequence.elem, sequence.params);
			io.unobserve(entry.target);
		});
	}, { threshold: (Array.apply(0, Array(21)) as any[]).map((_item, index) => index * 0.05) });

	containers.forEach(sequence => io.observe(sequence.elem));
*/
};

export default revealScript;
