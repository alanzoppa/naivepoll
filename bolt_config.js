"use strict";
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInvalid = void 0;
// TODO better way to determine this
const isInvalid = (message) => {
    return ("message" in message) || ("subtype" in message);
};
exports.isInvalid = isInvalid;
