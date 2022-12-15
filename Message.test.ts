import {describe, expect, test} from '@jest/globals';
import {Message, wordIsEmoji} from "./Message";
import natural from "natural";


describe("tagging", () => {
    test("initializing happy path", ()=> {
        let taggedObj = new Message("Where should we go? Pequod's or Gino's?")
        expect(taggedObj.sentences.length).toBe(2)
    })
})

describe("Sentence", () => {
    let question = new Message("Where should we go? Pequod's or Gino's?");
    let statement = new Message("Just a declarative statement.");
    let multiword = new Message("Kevin's stinky Pizza or Todd's greasy pasta?");
    let snooting = new Message("Should we go snooting, micro snooting, or retro snooting?");
    let emojis = new Message("Should we get pizza or beer?");
    let emojis_actual = new Message("What do you think? Should we get a pet :frog: or a pet chicken?");


    test("word tokenization", ()=> {
        console.log(emojis_actual.sentences[1].tags)
        expect(emojis_actual.sentences[1].tags[4].token).toEqual("pet :frog:");
    })

    test("isQuestion", ()=> {
        expect(question.sentences[0].isQuestion).toBe(true);
        expect(statement.sentences[0].isQuestion).toBe(false);
    })

    test("coalesce possesives", ()=> {
        //  [ "Pequod's", 'or', "Gino's", '?' ]
        expect(question.sentences[1].tags[0].token).toEqual("Pequod's");
        expect(question.sentences[1].tags[2].token).toEqual("Gino's");
    })

    test("coalesce hasOrClause", ()=> {
        expect(question.sentences[0].hasOrClause).toEqual(false);
        expect(question.sentences[1].hasOrClause).toEqual(true);
    })

    test("orClauses", ()=> {
        expect(question.sentences[0].orClauses).toEqual([]);
        let oc:any;
        oc = question.sentences[1].orClauses;
        expect(oc[0].index).toBe(1);
    })

    test("collapse nouns", ()=> {
        expect(multiword.sentences[0].tags.map((t)=> t.token)).toEqual(
            ["Kevin's stinky Pizza", "or", "Todd's greasy pasta", "?"]
        )
        expect(snooting.sentences[0].tags.map((t)=> t.token)).toEqual(
            ["Should", "we", "go", "snooting", ",", "micro snooting", ",", "or", "retro snooting", "?"]
        )
    })

    test ("nouns", ()=> {
        expect(
            snooting.sentences[0].nouns
            ).toEqual(
                ["micro snooting", "retro snooting"]
            )

        expect(
            emojis_actual.sentences[1].nouns
            ).toEqual(
                ["pet :frog:", "pet chicken"]
            )
    })

    test ("emojifiedNounList", ()=> {
        expect(
            emojis.sentences[0].emojifiedNounsList
            ).toEqual(
                [':pizza:', ':beer:']
            )

        expect(
            emojis_actual.sentences[1].emojifiedNounsList
            ).toEqual(
                ["pet :frog:", "pet chicken"]
            )
    })

    test ("pollOptions", ()=> {
        expect(
            emojis.sentences[0].pollOptions
            ).toEqual(`":pizza:" ":beer:"`)
    })

})

describe("wordIsEmoji", () => {
    test("case insensitivity", ()=> {
        expect(wordIsEmoji("pizza")).toBe(true);
        expect(wordIsEmoji("Pizza")).toBe(true);
    })
})
