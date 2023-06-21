export type Direction = '-x' | 'x' | '-y' | 'y';

export interface RevealItem {
	elem: HTMLElement;
	params: {
		translate: number;
		direction: Direction;
		order: number;
		delay: number | null;
		transitionDelay?: number;
	};
}

export interface Sequence {
	container: HTMLElement;
	params: {
		trigger: number;
		blockDelay: number;
		itemDelay: number;
	};
	items: RevealItem[];
}