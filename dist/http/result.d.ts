import type { ReadStream } from "node:fs";
import { type JSONValue, type Mime } from "pimpanzee";
import { type HttpStatus } from "./status.js";
export type ErrorJson = {
    exception: {
        name: string;
        message: string;
        backtrace?: string | undefined;
    };
};
export declare class HttpResult {
    readonly status: HttpStatus;
    readonly content: string | ReadStream;
    readonly headers: Headers | Map<string, number | string | readonly string[]>;
    static ok(): HttpResult;
    static status(s: HttpStatus): HttpResult;
    static json(json: JSONValue, status?: HttpStatus): HttpResult;
    static raw_json(json: string | ReadStream, status?: HttpStatus): HttpResult;
    static error_json(json: ErrorJson, status: HttpStatus): HttpResult;
    static html(s: string | ReadStream): HttpResult;
    static file(s: ReadStream, mime: Mime): HttpResult;
    constructor(status: HttpStatus, content: string | ReadStream, headers: Headers | Map<string, number | string | readonly string[]>);
}
