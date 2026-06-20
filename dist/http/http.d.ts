import type { IncomingMessage, ServerResponse } from "node:http";
import { type JSONValue } from "pimpanzee";
import { RequestMethod } from "./request_method.js";
export declare class HttpRequest {
    readonly req: IncomingMessage;
    method: RequestMethod;
    readonly started_at: number;
    constructor(req: IncomingMessage);
    get url(): string | undefined;
    get body(): Promise<string>;
    get body_as_json(): Promise<JSONValue>;
    time_passed(): number;
}
export declare class HttpResponse {
    readonly raw: ServerResponse;
    constructor(raw: ServerResponse);
}
