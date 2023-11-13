
export const mergeIfUpdated = (target: object, mutation: object) => {

	for (let prop in mutation) {

		const next = mutation[prop];

		if (typeof next === 'number' && isNaN(next))
			continue;
		else if (typeof next === 'string' && !next?.length)
			continue;
		else if (next === null)
			continue;
		else if (typeof next === 'object' && !Array.isArray(next))
			mergeIfUpdated(target[prop], next);
		else target[prop] = next;
	}
};

export const deepClone = <T extends object>(source: T) => {

	if (typeof source !== 'object') return source;

	const result = Array.isArray(source) ? [] : {};

	for (let key in source) {
		(result[key as keyof typeof result] as T) = deepClone(source[key as keyof typeof source] as T);
	}

	return result as T;
};
