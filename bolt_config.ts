// @ts-nocheck

// TODO better way to determine this
export const isInvalid = (message:object) => {
	return ("message" in message) || ("subtype" in message);
}