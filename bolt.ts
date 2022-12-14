import { App, LogLevel, subtype, BotMessageEvent, BlockAction, AwsLambdaReceiver } from '@slack/bolt';
import {Message} from "./Message";
import {receiver, handler} from "./bolt_config";


let appConfig;

if (process.env.SLACK_SOCKET_MODE == "true") {
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
}


const app = new App(appConfig);

app.message(async ({ message, client }) => {
	console.log(message);

	// @ts-ignore https://github.com/slackapi/bolt-js/issues/904
    let msg = new Message(message.text);

	// @ts-ignore https://github.com/slackapi/bolt-js/issues/904
	let user = message.user;


	for (let sentence of msg.sentences) {
		if (sentence.hasOrClause) {
			let nouns = sentence.nouns.map(s => `"${s.token}"`)
			let rawSentence = sentence.tags.map(t => t.token).join(" ");
			let simplePollText = `Make this a poll! Just send this slash command: \`/poll "${rawSentence}" ${nouns.join(" ")}\``;

			await client.chat.postEphemeral({
				channel: message.channel,
				user: user,
				text: simplePollText
				// text: `\`${JSON.stringify(sentence.nouns.map(s => s.token))}\``
			})
		
		}
	}

});

(async () => {
	// Start the app
	await app.start(process.env.PORT || 3000);
	console.log('⚡️ Bolt app is running!');
})();

module.exports.handler = handler;