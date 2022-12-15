import natural, { TaggedWord } from "natural";
import emoji from './default_emoji.json';

// @ts-ignore this type/arity problem in natural/@types
const lexicon = new natural.Lexicon("EN", "?", "NNP");
const ruleSet = new natural.RuleSet('EN');
const tagger = new natural.BrillPOSTagger(lexicon, ruleSet);
const st = new natural.SentenceTokenizer();
// const wt = new natural.WordPunctTokenizer();

const wt = new natural.RegexpTokenizer({pattern: /([A-zÀ-ÿ-]+|[0-9._]+|.|!|\?|'|"|;|,|-)/});



export let wordIsEmoji = (word:string):boolean => {
    return word.toLowerCase() in emoji;
}

export class Sentence {
    tags: TaggedWord[];
    rawSentence: string;
    static nounTypes = ['NN', 'NNP'];
    static phraseTypes = ['NN', 'NNS', 'NNP', 'NNPS', 'JJ', '?', ':'];

    constructor(sentence: string) {
        this.rawSentence = sentence;
        this.tags = tagger.tag(wt.tokenize(sentence)).taggedWords
        this.coalesce_possesives();
        this.collapseNouns();
    }

    private collapseNouns():void {
        for (let i = 0; i < this.tags.length; i++) {
            let [curr, next] = [this.tags[i], this.tags[i+1]]
            if (Sentence.phraseTypes.includes(curr?.tag)) {
                let tmp_next = next;
                let cursor = 1;
                while (Sentence.phraseTypes.includes(tmp_next?.tag)) {
                    curr.token = curr.token + " " + tmp_next.token;
                    curr.tag = "NNP";
                    delete this.tags[i+cursor];
                    cursor++;
                    tmp_next = this.tags[i+cursor];
                }

            }
        };
        this.tags = this.tags.filter(Boolean);
        this.fixEmoji();
    }

    // This really really needs to be a parser rule
    private fixEmoji():void {
        for (let tag of this.tags) {
            tag.token = tag.token.replace(/: (\w+) :/g, ":$1:");
        }
    }

    private coalesce_possesives():void {
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

    get nouns():string[] {
        return this.tags.filter( t => t.tag[0] == "N" ).map(s => s.token);
    }

    get emojifiedNounsList():string[] {
        return this.nouns.map(s => wordIsEmoji(s) ? `:${s.toLowerCase()}:` : s)
    }

    get pollOptions():string {
        return this.emojifiedNounsList.map(n => `"${n}"`).join(" ")
    }

    get isQuestion():boolean {
        return this.tags[this.tags.length-1].token == '?'
    }

    get hasOrClause():boolean {
        return this.tags.some( tag => (tag.token == 'or' && tag.tag == 'CC') )
    }

    get orClauses():object[] {
        if (!this.hasOrClause) {return []}
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