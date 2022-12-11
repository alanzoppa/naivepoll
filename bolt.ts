import { App, LogLevel, subtype, BotMessageEvent, BlockAction } from '@slack/bolt';




const app = new App({
	signingSecret: process.env.SIGNING_SECRET,
	token: process.env.TOKEN,
	socketMode: true,
	appToken: process.env.APP_TOKEN
});

/* Add functionality here */




app.message(async ({ message, say }) => {
	console.log(message);
	await say("hi");
});

(async () => {
	// Start the app
	await app.start(process.env.PORT || 3000);

	console.log('⚡️ Bolt app is running!');


})();