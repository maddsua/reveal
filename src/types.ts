export type Direction = '-x' | 'x' | '-y' | 'y';

export interface Translate {
	direction: Direction;
	amountEm: number;
};

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

export interface RevealItemParams {
	threshold: number | undefined;	//	t25
	childDelay: number;				//	cd250
	delay: number;					//	d125
	translate: Translate;			//	tl2
	transitionDelay: number;		//	td250
	index: number;					//	i5
};
