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
					"text": "Make this a poll!",
					"emoji": true
				},
				"value": message,
				"action_id": `createPoll__${id}`
			}
		}
	]
}

export const makePoll = (votes:any[][]) => {
    let buttons = votes.map( (v,i,ary) => {
        return {
            "type": "button",
            "text": {
                "type": "plain_text",
                "text": `${v[0]} (${v[1]})`,
                "emoji": true
            },
            "value": JSON.stringify(ary),
            "action_id": `increment__${v[0]}`
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

