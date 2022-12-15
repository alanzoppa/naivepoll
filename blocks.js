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
                "action_id": `createPoll__${id}`
            }
        }
    ];
};
exports.makePollButton = makePollButton;
const makePoll = (votes) => {
    let buttons = votes.map((v, i, ary) => {
        return {
            "type": "button",
            "text": {
                "type": "plain_text",
                "text": `${v[0]} (${v[1]})`,
                "emoji": true
            },
            "value": JSON.stringify(ary),
            "action_id": `increment__${v[0]}`
        };
    });
    return [
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
};
exports.makePoll = makePoll;
