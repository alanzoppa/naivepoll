"use strict";
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInvalid = exports.receiver = void 0;
exports.receiver = new AwsLambdaReceiver({
    signingSecret: process.env.SIGNING_SECRET,
});
// TODO better way to determine this
const isInvalid = (message) => {
    return ("message" in message) || ("subtype" in message);
};
exports.isInvalid = isInvalid;
