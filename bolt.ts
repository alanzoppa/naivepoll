import { App, LogLevel, subtype, BotMessageEvent, BlockAction, AwsLambdaReceiver } from '@slack/bolt';
import {Message, Sentence} from "./Message";
import {receiver, handler} from "./bolt_config";
import {makePollButton, makePoll} from "./blocks";

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


app.action(/^increment/, async ({action, ack, say}) => { 
	await ack();
	console.log(action);
	// @ts-ignore https://github.com/slackapi/bolt-js/issues/904
	let sentence = new Sentence(action.value);
	let blocks = makePoll(sentence.nouns);
	say({
			text: `This is a poll The options are ${sentence.emojifiedNounsList}`,
			blocks: blocks
		});
  });




(async () => {
	await app.start(process.env.PORT || 3000);
	console.log('⚡️ Bolt app is running!');
})();

module.exports.handler = handler;