"use strict";
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiver = void 0;
const bolt_1 = require("@slack/bolt");
exports.receiver = new bolt_1.AwsLambdaReceiver({
    signingSecret: process.env.SIGNING_SECRET,
});
