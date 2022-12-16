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
    if ((0, bolt_config_1.isInvalid)(message))
        return;
    if (DEVELOPMENT) {
        console.log(message);
    }
    ;
    // @ts-ignore https://github.com/slackapi/bolt-js/issues/904
    let [msg, user] = [new Message_1.Message(message.text), message.user];
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
    // @ts-ignore
    let sentence = new Message_1.Sentence(action.value);
    let votes = sentence.nouns.map(noun => [noun, 0]);
    let blocks = (0, blocks_1.makePoll)(votes);
    say({
        text: sentence.rawSentence,
        blocks: blocks
    });
}));
app.action(/^increment/, ({ action, ack, say, client, body }) => __awaiter(void 0, void 0, void 0, function* () {
    yield ack();
    // console.log(action);
    // console.log(body);
    // @ts-ignore https://github.com/slackapi/bolt-js/issues/904
    let [og_text, poll_ts, channel_id, noun, value] = [body.message.text, body.container.message_ts, body.container.channel_id, action.text.text, JSON.parse(action.value)];
    noun = noun.replace(/ \(\d+\)/, '');
    let poll_message = yield client.conversations.history({
        channel: channel_id,
        latest: poll_ts,
        inclusive: true,
        limit: 1
    });
    poll_message = poll_message === null || poll_message === void 0 ? void 0 : poll_message.messages[0];
    for (let i = 0; i < value.length; i++) {
        console.log(noun, value[i]);
        if (value[i][0] == noun) {
            value[i][1] += 1;
        }
    }
    console.log(value);
    let blocks = (0, blocks_1.makePoll)(value);
    console.log(blocks[1]);
    client.chat.update({
        channel: channel_id,
        ts: poll_ts,
        blocks: blocks,
        as_user: true,
        text: "baz"
    });
}));
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield app.start(process.env.PORT || 3000);
    console.log('⚡️ Bolt app is running!');
}))();
module.exports.handler = bolt_config_1.handler;
