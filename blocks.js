"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePoll = exports.makePollButton = void 0;
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
const makePoll = (options) => {
    let buttons = options.map(noun => {
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
    let out = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "This is the poll"
            }
        },
        {
            "type": "actions",
            "elements": buttons
        }
    ];
    console.log(out);
    return out;
};
exports.makePoll = makePoll;
