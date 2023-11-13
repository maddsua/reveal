
export const assignNonNullish = <T extends object, U extends object>(target: T, update: U)  => {

	for (const key in update) {

		let next = update[key];
		switch (typeof next) {

			case 'string':
				if (!next.length) continue;
				target[key as unknown as keyof T] = next as T[keyof T];
				break;

			case 'number':
				if (isNaN(next)) continue;
				target[key as unknown as keyof T] = next as T[keyof T];
				break;

			case 'object':

				if (next === null) continue;

				if (!target[key as unknown as keyof T])
					target[key as unknown as keyof T] = {} as T[keyof T];

				assignNonNullish(target[key as unknown as keyof T] as object, next);
				break;

			default:
				break;
		}
	}

	return target as T & U;
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

export const deepClone = <T extends object>(source: T) => {

	if (typeof source !== 'object') return source;

	const result = Array.isArray(source) ? [] : {};

	for (let key in source) {
		(result[key as keyof typeof result] as T) = deepClone(source[key as keyof typeof source] as T);
	}

	return result as T;
};

export function mergeNonNullish<T extends object, U extends object>(a: T, b: U) {

	const target = {} as T;

	for (let update of arguments) {

		for (const key in update) {

			let next = update[key];
			switch (typeof next) {
	
				case 'string':
					if (!next.length) continue;
					target[key as unknown as keyof T] = next as T[keyof T];
					break;
	
				case 'number':
					if (isNaN(next)) continue;
					target[key as unknown as keyof T] = next as T[keyof T];
					break;
	
				case 'object':
	
					if (next === null) continue;
	
					if (!target[key as unknown as keyof T])
						target[key as unknown as keyof T] = {} as T[keyof T];
	
					assignNonNullish(target[key as unknown as keyof T] as object, next);
					break;
	
				default:
					break;
			}
		}
	};

	return target as T & U;
};
