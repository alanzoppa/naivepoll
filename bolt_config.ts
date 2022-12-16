// @ts-nocheck

import { AwsLambdaReceiver } from '@slack/bolt';

export const receiver = new AwsLambdaReceiver({
	signingSecret: process.env.SIGNING_SECRET,
});

export const handler = async (event, context, callback) => {
    const handler = await receiver.start();
    return handler(event, context, callback);
}

// TODO better way to determine this
export const isInvalid = (message:object) => {
	return ("message" in message) || ("subtype" in message);
}