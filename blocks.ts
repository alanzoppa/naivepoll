import {Message, Sentence} from "./Message";



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

export const makePoll = (options:string[]) => {

    let buttons = options.map( noun => {
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

    ]
    console.log(out);

    return out




}

