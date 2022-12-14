import { App, LogLevel, subtype, BotMessageEvent, BlockAction, AwsLambdaReceiver } from '@slack/bolt';
import {Message} from "./Message";
import {receiver} from "./bolt_config";


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
	//expect(question.sentences[0].hasOrClause).toEqual(false);



	await client.chat.postEphemeral({
		channel: message.channel,
		// @ts-ignore https://github.com/slackapi/bolt-js/issues/904
		user: message.user,
		text: `\`${JSON.stringify(msg.sentences.map( (s)=> {return s.tags} ), null, "  ")}\``
	})
});

(async () => {
	// Start the app
	await app.start(process.env.PORT || 3000);

	console.log('⚡️ Bolt app is running!');


})();