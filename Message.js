"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = exports.Sentence = exports.wordIsEmoji = void 0;
const natural_1 = __importDefault(require("natural"));
const default_emoji_json_1 = __importDefault(require("./default_emoji.json"));
// @ts-ignore this type/arity problem in natural/@types
const lexicon = new natural_1.default.Lexicon("EN", "?", "NNP");
const ruleSet = new natural_1.default.RuleSet('EN');
const tagger = new natural_1.default.BrillPOSTagger(lexicon, ruleSet);
const st = new natural_1.default.SentenceTokenizer();
const wt = new natural_1.default.WordPunctTokenizer();
let wordIsEmoji = (word) => {
    return word.toLowerCase() in default_emoji_json_1.default;
};
exports.wordIsEmoji = wordIsEmoji;
class Sentence {
    constructor(sentence) {
        this.rawSentence = sentence;
        this.tags = tagger.tag(wt.tokenize(sentence)).taggedWords;
        this.coalesce_possesives();
        this.collapseNouns();
    }
    // This turns sequential related tokens into a single phrase
    // e.g. ["Should", "we", "get", "thin", "crust", "pizza", "or", "german", "beer", "?"] =>
    //      ["Should", "we", "get", "thin crust pizza", "or", "german beer", "?"] =>
    collapseNouns() {
        for (let i = 0; i < this.tags.length; i++) {
            let [curr, next] = [this.tags[i], this.tags[i + 1]];
            if (Sentence.phraseTypes.includes(curr === null || curr === void 0 ? void 0 : curr.tag)) {
                let tmp_next = next;
                let cursor = 1;
                while (Sentence.phraseTypes.includes(tmp_next === null || tmp_next === void 0 ? void 0 : tmp_next.tag)) {
                    curr.token = curr.token + " " + tmp_next.token;
                    curr.tag = "NNP";
                    delete this.tags[i + cursor];
                    cursor++;
                    tmp_next = this.tags[i + cursor];
                }
            }
        }
        ;
        this.tags = this.tags.filter(Boolean);
        this.fixEmoji();
    }
    // This really really needs to be a natural parser rule
    fixEmoji() {
        for (let tag of this.tags) {
            tag.token = tag.token.replace(/: (\w+) :/g, ":$1:");
        }
    }
    // de-tokenizes possessives when they're part of an or clause
    coalesce_possesives() {
        for (let i = 0; i < this.tags.length; i++) {
            let [curr, next, next_next] = [
                this.tags[i],
                this.tags[i + 1],
                this.tags[i + 2]
            ];
            if (Sentence.nounTypes.includes(curr === null || curr === void 0 ? void 0 : curr.tag) &&
                (next === null || next === void 0 ? void 0 : next.token) == "'" &&
                (next_next === null || next_next === void 0 ? void 0 : next_next.token) == "s") {
                this.tags[i].token += "'s";
                delete this.tags[i + 1];
                delete this.tags[i + 2];
            }
            // Weirdo JS behavior because arrays don't really exist
            this.tags = this.tags.filter(Boolean);
        }
    }
    get nouns() {
        return this.tags.filter(t => t.tag[0] == "N").map(s => s.token);
    }
    get emojifiedNounsList() {
        return this.nouns.map(s => (0, exports.wordIsEmoji)(s) ? `:${s.toLowerCase()}:` : s);
    }
    get pollOptions() {
        return this.emojifiedNounsList.map(n => `"${n}"`).join(" ");
    }
    get isQuestion() {
        return this.tags[this.tags.length - 1].token == '?';
    }
    get hasOrClause() {
        return this.tags.some(tag => (tag.token == 'or' && tag.tag == 'CC'));
    }
    get orClauses() {
        if (!this.hasOrClause) {
            return [];
        }
        let output = [];
        this.tags.forEach((val, i) => {
            if (val.token == 'or') {
                output.push({ index: i });
            }
        });
        return output;
    }
}
exports.Sentence = Sentence;
Sentence.nounTypes = ['NN', 'NNP'];
Sentence.phraseTypes = ['NN', 'NNS', 'NNP', 'NNPS', 'JJ', '?', ':'];
class Message {
    constructor(msg) {
        this.rawMessage = msg;
        this.sentences = st.tokenize(msg).map(s => new Sentence(s));
    }
}
exports.Message = Message;
