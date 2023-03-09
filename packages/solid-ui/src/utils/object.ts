// copy an object without reference
export const isObject = (target: unknown) => target && typeof target === "object"

export const copyObject = (obj: any): object => {
	if (!isObject(obj)) return obj
	if (obj instanceof Array) return [...obj]

	return { ...obj }
}
