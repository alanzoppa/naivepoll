"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const natural_1 = __importDefault(require("natural"));
const util = __importStar(require("util"));
class Sentence {
    constructor(taggedSentence) {
        this.tags = taggedSentence;
        this.coalesce_possesives();
        this.collapse_nouns();
    }
    // 
    collapse_nouns() {
        for (let i = 0; i < this.tags.length; i++) {
            let [curr, next] = [this.tags[i], this.tags[i + 1]];
            let allowList = ['NN', 'NNS', 'NNP', 'NNPS', 'JJ', '?'];
            if (allowList.includes(curr === null || curr === void 0 ? void 0 : curr.tag)) {
                let tmp_next = next;
                let cursor = 1;
                while (allowList.includes(tmp_next === null || tmp_next === void 0 ? void 0 : tmp_next.tag)) {
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
    }
    coalesce_possesives() {
        for (let i = 0; i < this.tags.length; i++) {
            let [curr, next, next_next] = [this.tags[i], this.tags[i + 1], this.tags[i + 2]];
            if (['NN', 'NNP'].includes(curr === null || curr === void 0 ? void 0 : curr.tag) && (next === null || next === void 0 ? void 0 : next.token) == "'" && (next_next === null || next_next === void 0 ? void 0 : next_next.token) == "s") {
                this.tags[i].token += "'s";
                delete this.tags[i + 1];
                delete this.tags[i + 2];
            }
            this.tags = this.tags.filter(Boolean);
        }
    }
    get nouns() {
        return this.tags.filter((t) => {
            return (t.tag[0] == "N");
        });
    }
    get isQuestion() {
        return this.tags[this.tags.length - 1].token == '?';
    }
    get hasOrClause() {
        return this.tags.some((tag) => { return tag.token == 'or' && tag.tag == 'CC'; });
    }
    get orClauses() {
        if (!this.hasOrClause) {
            return null;
        }
        let output = [];
        this.tags.forEach((val, i) => {
            if (val.token == 'or') {
                let entry = { index: i };
                output.push(entry);
            }
        });
        return output;
    }
}
// @ts-ignore this type/arity disagreement
const lexicon = new natural_1.default.Lexicon("EN", "?", "NNP");
const ruleSet = new natural_1.default.RuleSet('EN');
const tagger = new natural_1.default.BrillPOSTagger(lexicon, ruleSet);
const st = new natural_1.default.SentenceTokenizer();
const wt = new natural_1.default.WordPunctTokenizer();
class Message {
    constructor(msg) {
        this.rawMessage = msg;
        this.rawTokens = st.tokenize(msg).map(s => wt.tokenize(s));
        this.sentences = this.rawTokens.map(s => {
            return new Sentence(tagger.tag(s).taggedWords);
        });
    }
}
exports.Message = Message;
if (require.main === module) {
    let taggedObj = new Message("Where should we go? Pequod's or Gino's?");
    console.log(util.inspect(taggedObj.rawTokens, false, null, true));
    console.log(util.inspect(taggedObj.sentences, false, null, true));
    let declarative = new Message("The quick brown fox jumped over the lazy dog.");
    console.log(util.inspect(declarative.sentences, false, null, true));
    console.log(util.inspect(lexicon, false, null, true));
    console.log(util.inspect(ruleSet, false, null, true));
}
