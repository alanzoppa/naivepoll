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
				"action_id": `createPoll__${id}`
			}
		}
	]
}

export const makePoll = (votes:any[][], id:string) => {
    let buttons = votes.map( (v,i) => {
        return {
            "type": "button",
            "text": {
                "type": "plain_text",
                "text": v[0],
                "emoji": true
            },
            "value": `${v[1]}`,
            "action_id": `increment__${id}__${i}`
        }
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

    ]




}

