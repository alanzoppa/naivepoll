// @ts-nocheck

export const receiver = new AwsLambdaReceiver({
	signingSecret: process.env.SIGNING_SECRET,
});

// TODO better way to determine this
export const isInvalid = (message:object) => {
	return ("message" in message) || ("subtype" in message);
}