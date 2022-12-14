import natural, { TaggedWord } from "natural";


// @ts-ignore this type/arity problem in natural/@types
const lexicon = new natural.Lexicon("EN", "?", "NNP");
const ruleSet = new natural.RuleSet('EN');
const tagger = new natural.BrillPOSTagger(lexicon, ruleSet);
const st = new natural.SentenceTokenizer();
const wt = new natural.WordPunctTokenizer();


class Sentence {
    tags: TaggedWord[];
    rawSentence: string;
    static nounTypes = ['NN', 'NNP'];

    constructor(sentence: string) {
        this.rawSentence = sentence;
        this.tags = tagger.tag(wt.tokenize(sentence)).taggedWords
        this.coalesce_possesives();
        this.collapse_nouns();
    }

    private collapse_nouns() {
        for (let i = 0; i < this.tags.length; i++) {
            let [curr, next] = [this.tags[i], this.tags[i+1]]
            let allowList = ['NN', 'NNS', 'NNP', 'NNPS', 'JJ', '?'];
            if (allowList.includes(curr?.tag)) {
                let tmp_next = next;
                let cursor = 1;
                while (allowList.includes(tmp_next?.tag)) {
                    curr.token = curr.token + " " + tmp_next.token;
                    curr.tag = "NNP"
                    delete this.tags[i+cursor];
                    cursor++;
                    tmp_next = this.tags[i+cursor];
                }

            }
        };
        this.tags = this.tags.filter(Boolean);
    }

    private coalesce_possesives() {
        for (let i = 0; i < this.tags.length; i++) {
            let [curr, next, next_next] = [
                this.tags[i],
                this.tags[i+1],
                this.tags[i+2]
            ]
            if ( Sentence.nounTypes.includes(curr?.tag) &&
                 next?.token == "'" &&
                 next_next?.token == "s"
                ) {
                    this.tags[i].token += "'s";
                    delete this.tags[i+1];
                    delete this.tags[i+2];
            }
            this.tags = this.tags.filter(Boolean);
        }
    } 

    get nouns() {
        return this.tags.filter( t => t.tag[0] == "N" );
    }

    get isQuestion() {
        return this.tags[this.tags.length-1].token == '?'
    }

    get hasOrClause() {
        return this.tags.some( tag => (tag.token == 'or' && tag.tag == 'CC') )
    }

    get orClauses() {
        if (!this.hasOrClause) {return null}
        let output:object[]   = [];
        this.tags.forEach( (val, i)=> {
            if (val.token == 'or') {
                let entry = {index: i};
                output.push(entry)
            }
        })
        return output;
    }
}


export class Message {
    rawMessage: string;
    sentences: Sentence[];

    constructor(msg: string) {
        this.rawMessage = msg;
        this.sentences = st.tokenize(msg).map( s => new Sentence(s) )
    }
}