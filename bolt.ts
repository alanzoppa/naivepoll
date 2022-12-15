import { App, LogLevel, subtype, BotMessageEvent, BlockAction, AwsLambdaReceiver, ViewStateValue } from '@slack/bolt';
import {Message, Sentence} from "./Message";
import {receiver, handler, isInvalid} from "./bolt_config";
import {makePollButton, makePoll} from "./blocks";
import * as util from "util";

const DEVELOPMENT = (process.env.DEVELOPMENT == "true");

let appConfig;

if (DEVELOPMENT) {
	appConfig = {
		signingSecret: process.env.SIGNING_SECRET,
		token: process.env.TOKEN,
		socketMode: true,
		appToken: process.env.APP_TOKEN
	};
}
else {
	appConfig = {
		token: process.env.TOKEN,
		receiver: receiver
	}
};


const app = new App(appConfig);




app.message(async ({ message, client }) => {
	if (isInvalid(message)) return;
	if (DEVELOPMENT) { console.log(message) };

	// @ts-ignore https://github.com/slackapi/bolt-js/issues/904
    let msg = new Message(message.text);

	// @ts-ignore https://github.com/slackapi/bolt-js/issues/904
	let user = message.user;


	for (let sentence of msg.sentences) {
		if (sentence.hasOrClause) {
			let simplePollText = `Make this a poll! Just send this slash command: \n\`/poll "${sentence.rawSentence}" ${sentence.pollOptions}\``;
			// @ts-ignore https://github.com/slackapi/bolt-js/issues/904
			
			let blocks = makePollButton(sentence.rawSentence, message.client_msg_id);
			await client.chat.postEphemeral({
				channel: message.channel,
				user: user,
				blocks: blocks,
				text: simplePollText
			})
		}
	}
});


app.action(/^createPoll/, async ({action, ack, say, body}) => { 
	await ack();
	// @ts-ignore
	let sentence = new Sentence(action.value);
	let votes = sentence.nouns.map( noun => [noun, 0] );
	let blocks = makePoll(votes);
	say({
			text: sentence.rawSentence,
			blocks: blocks
		});
  });


app.action(/^increment/, async ({action, ack, say, client, body}) => { 
	await ack();
	// console.log(action);
	// console.log(body);

	// @ts-ignore https://github.com/slackapi/bolt-js/issues/904
	let [og_text, poll_ts, channel_id, noun, value] = [body.message.text, body.container.message_ts, body.container.channel_id, action.text.text, JSON.parse(action.value)]

	noun = noun.replace(/ \(\d+\)/, '');

	let poll_message:any = await client.conversations.history({
		channel: channel_id,
		latest: poll_ts,
		inclusive: true,
		limit: 1
	});
	poll_message = poll_message?.messages[0];

	for (let i = 0; i < value.length; i++) {
		console.log(noun, value[i])
		if (value[i][0] == noun) {
			value[i][1] += 1;
		}
	}

	console.log(value);

	let blocks = makePoll(value);
	console.log(blocks[1]);

	client.chat.update({
		channel: channel_id,
		ts: poll_ts,
		blocks: blocks,
		as_user: true,
		text: "baz"
	});



	// say({
	// 	channel: channel_id,
	// 	// ts: poll_ts,
	// 	blocks: blocks,
	// 	// as_user: true,
	// 	text: "baz"
	// });
	// client.chat.delete({ channel: channel_id, ts: poll_ts})

  });


(async () => {
	await app.start(process.env.PORT || 3000);
	console.log('⚡️ Bolt app is running!');
})();

module.exports.handler = handler;