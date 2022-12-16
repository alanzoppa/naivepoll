"use strict";
// @ts-nocheck
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInvalid = exports.handler = exports.receiver = void 0;
const bolt_1 = require("@slack/bolt");
exports.receiver = new bolt_1.AwsLambdaReceiver({
    signingSecret: process.env.SIGNING_SECRET,
});
const handler = (event, context, callback) => __awaiter(void 0, void 0, void 0, function* () {
    const handler = yield exports.receiver.start();
    return handler(event, context, callback);
});
exports.handler = handler;
// TODO better way to determine this
const isInvalid = (message) => {
    return ("message" in message) || ("subtype" in message);
};
exports.isInvalid = isInvalid;
