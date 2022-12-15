import {Message} from "./Message";



export const makePollButton = (message:string, id:string) => {
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
	]
}

export const makePoll = (text:string, id:string) => {

    let sentence = new Message(text)?.sentences[0];
    let buttons = sentence.nouns.map( noun => {
        return {
            "type": "button",
            "text": {
                "type": "plain_text",
                "text": noun,
                "emoji": true
            },
            "value": "click_me_123"
        }
    });

    return [
		{
			"type": "actions",
			"elements": [ buttons ]
		}
	]
}