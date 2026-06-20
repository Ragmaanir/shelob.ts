import type { HttpContext } from "../http/context.js";
import { HttpResult } from "../http/result.js";
export declare class StaticFileHandler {
    readonly root: string;
    constructor(root: string);
    call(ctx: HttpContext): HttpResult;
}
