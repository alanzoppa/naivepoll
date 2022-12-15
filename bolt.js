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
const blocks_1 = require("./blocks");
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
        receiver: bolt_config_1.receiver
    };
}
;
const app = new bolt_1.App(appConfig);
app.message(({ message, client }) => __awaiter(void 0, void 0, void 0, function* () {
    if (DEVELOPMENT) {
        console.log(message);
    }
    ;
    // @ts-ignore https://github.com/slackapi/bolt-js/issues/904
    let msg = new Message_1.Message(message.text);
    // @ts-ignore https://github.com/slackapi/bolt-js/issues/904
    let user = message.user;
    for (let sentence of msg.sentences) {
        if (sentence.hasOrClause) {
            let simplePollText = `Make this a poll! Just send this slash command: \n\`/poll "${sentence.rawSentence}" ${sentence.pollOptions}\``;
            // @ts-ignore https://github.com/slackapi/bolt-js/issues/904
            let blocks = (0, blocks_1.makePollButton)(sentence.rawSentence, message.client_msg_id);
            yield client.chat.postEphemeral({
                channel: message.channel,
                user: user,
                blocks: blocks,
                text: simplePollText
            });
        }
    }
}));
app.action(/^createPoll/, ({ action, ack, say, body }) => __awaiter(void 0, void 0, void 0, function* () {
    yield ack();
    console.log(action);
    // console.log(body);
    // @ts-ignore https://github.com/slackapi/bolt-js/issues/904
    let sentence = new Message_1.Sentence(action.value);
    // let [sentence, id] = [new Sentence(action.value), body.container.message_ts]
    let votes = sentence.nouns.map(noun => [noun, 0]);
    let blocks = (0, blocks_1.makePoll)(votes);
    say({
        text: `This is a poll The options are ${sentence.emojifiedNounsList}`,
        blocks: blocks
    });
}));
app.action(/^increment/, ({ action, ack, say, client, body }) => __awaiter(void 0, void 0, void 0, function* () {
    yield ack();
    console.log(action);
    // console.log(body);
    // @ts-ignore https://github.com/slackapi/bolt-js/issues/904
    let [channel, target_ts, channel_id, noun, value] = [action.channel, body.container.message_ts, body.container.channel_id, action.text.text, parseInt(action.value)];
    let original_message = yield client.conversations.history({
        channel: channel_id,
        latest: target_ts,
        inclusive: true,
        limit: 1
    });
    original_message = original_message === null || original_message === void 0 ? void 0 : original_message.messages[0];
    console.log(original_message);
    // client.chat.update({ channel: channel, ts: target_ts, blocks: makePoll});
}));
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield app.start(process.env.PORT || 3000);
    console.log('⚡️ Bolt app is running!');
}))();
module.exports.handler = bolt_config_1.handler;
