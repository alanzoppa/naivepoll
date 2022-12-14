// @ts-nocheck

import { AwsLambdaReceiver } from '@slack/bolt';

export const receiver = new AwsLambdaReceiver({
	signingSecret: process.env.SIGNING_SECRET,
});

