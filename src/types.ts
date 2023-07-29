export type Direction = '-x' | 'x' | '-y' | 'y';

export interface Translate {
	direction: Direction;
	amountEm: number;
};

export type RevealItemParams = {
	delay: number;					//	d125
	translate: Translate;			//	tl2
	index: number;					//	i5
};

export interface RevealItem {
	elem: HTMLElement;
	params: RevealItemParams;
}

export type RevealContainerParams = {
	threshold: number | undefined;	//	t25
	childDelay: number;				//	cd250
	translate: Translate;			//	tl2
	index: number;					//	i5
} & RevealItemParams;

export interface RevealContainer {
	elem: HTMLElement;
	items: RevealItem[];
	params: RevealContainerParams;
}
