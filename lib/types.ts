export type Direction = 'x' | '-x' | 'y' | '-y';

export interface Translate {
	direction: Direction;
	amountEm: number;
};

export interface RevealParams {
	threshold: number;			//	t25 - reveal threshold in persents
	delay: number;				//	d125 - animation delay
	length: number;				//	l250 - animation length
	translate: Translate;		//	tl2 - transform
	index: number;				//	i5 - reveal order
};

export interface ChildTranslate extends Omit<Translate, 'direction'> {
	direction: Direction | null;
};

export interface ChildRevealParams extends Omit<RevealParams, 'translate'> {
	translate: ChildTranslate;
};

export interface RevealItemOptions {
	params: RevealParams;
	childParams: ChildRevealParams;
}

export interface RevealItem extends RevealItemOptions {
	elem: HTMLElement;
};

export interface ParentRavealElement extends RevealItem {
	children: RevealItem[];
};
