"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bolt_1 = require("@slack/bolt");
const Message_1 = require("./Message");
const bolt_config_1 = require("./bolt_config");
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
        receiver: bolt_config_1.receiver
    };
}
const app = new bolt_1.App(appConfig);
app.message(({ message, client }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(message);
    // @ts-ignore https://github.com/slackapi/bolt-js/issues/904
    let msg = new Message_1.Message(message.text);
    // @ts-ignore https://github.com/slackapi/bolt-js/issues/904
    let user = message.user;
    for (let sentence of msg.sentences) {
        if (sentence.hasOrClause) {
            let nouns = sentence.nouns.map(s => `"${s.token}"`);
            let rawSentence = sentence.tags.map(t => t.token).join(" ");
            let simplePollText = `Make this a poll! Just send this slash command: \`/poll "${rawSentence}" ${nouns.join(" ")}\``;
            yield client.chat.postEphemeral({
                channel: message.channel,
                user: user,
                text: simplePollText
                // text: `\`${JSON.stringify(sentence.nouns.map(s => s.token))}\``
            });
        }
    }
}));
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Start the app
    yield app.start(process.env.PORT || 3000);
    console.log('⚡️ Bolt app is running!');
}))();
module.exports.handler = bolt_config_1.handler;
