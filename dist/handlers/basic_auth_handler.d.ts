import type { BasicAuthCredentials } from "../basic_auth_credentials.js";
import type { HttpContext } from "../http/context.js";
import { HttpResult } from "../http/result.js";
import { Handler } from "./handler.js";
export declare class BasicAuthHandler<C extends HttpContext = HttpContext> extends Handler<C> {
    readonly basic_auth: BasicAuthCredentials | null;
    readonly realm: string;
    constructor(basic_auth: BasicAuthCredentials | null, realm: string);
    call(context: C): Promise<HttpResult>;
}
