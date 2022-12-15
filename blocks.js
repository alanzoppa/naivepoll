"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePoll = exports.makePollButton = void 0;
const Message_1 = require("./Message");
const makePollButton = (message, id) => {
    return [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": message
            },
            "accessory": {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "Create Poll",
                    "emoji": true
                },
                "value": message,
                "action_id": `increment__${id}`
            }
        }
    ];
};
exports.makePollButton = makePollButton;
const makePoll = (text, id) => {
    var _a;
    let sentence = (_a = new Message_1.Message(text)) === null || _a === void 0 ? void 0 : _a.sentences[0];
    let buttons = sentence.nouns.map(noun => {
        return {
            "type": "button",
            "text": {
                "type": "plain_text",
                "text": noun,
                "emoji": true
            },
            "value": "click_me_123"
        };
    });
    return [
        {
            "type": "actions",
            "elements": [buttons]
        }
    ];
};
exports.makePoll = makePoll;
