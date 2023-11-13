import type { DeepPartial } from "./types";

export const assignNonNullish = <T extends object, U extends object>(source: T, mutation: U)  => {

	for (const key in mutation) {

		let next = mutation[key];
		switch (typeof next) {

			case 'string':
				if (!next.length) continue;
				break;

			case 'number':
				if (isNaN(next)) continue;
				break;

			case 'object':
				if (next === null) continue;
				if (!source[key]) source[key] = {};
				assignNonNullish(source[key], next);
				break;
			
			case 'undefined': {
				continue;
			}

			default:
				break;
		}

		source[key] = next;
	}

	return source as T & U;
};

export const filterNullish = <T extends object>(object: T) => {

	for (const key in object) {

		const prop = object[key];
		switch (typeof prop) {

			case 'string':
				if (!prop.length) delete object[key];
				break;

			case 'number':
				if (isNaN(prop)) delete object[key];
				break;

			case 'object':
				if (prop === null) delete object[key];
				filterNullish(prop as object);
				break;
			
			case 'undefined': {
				delete object[key];
			}

			default:
				break;
		}
	}

	return object;
};

export const mergeNonNullish = <T>(target: DeepPartial<T>, mutation: DeepPartial<T>) => {

	for (let prop in mutation) {

		const next = mutation[prop];

		if (!next) continue;

		switch (typeof next) {

			case 'string':
				if (!next.length) continue;
				break;

			case 'number':
				if (isNaN(next)) continue;
				break;

			case 'object':

				if (!target[prop])
					target[prop] = {};
					
				mergeNonNullish(target[prop], next);

				break;
		
			default:
				break;
		}

		target[prop] = next;
	}

	return target;
};

export const deepClone = <T extends object>(source: T) => {

	if (typeof source !== 'object') return source;

	const result = Array.isArray(source) ? [] : {};

	for (let key in source) {
		(result[key as keyof typeof result] as T) = deepClone(source[key as keyof typeof source] as T);
	}

	return result as T;
};
