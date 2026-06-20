import type { HttpRequest, HttpResponse } from "./http.js";
import type { HttpResult } from "./result.js";
export declare class HttpContext {
    readonly request: HttpRequest;
    readonly response: HttpResponse;
    constructor(request: HttpRequest, response: HttpResponse);
    get method(): import("./request_method.js").RequestMethod;
    get url(): string | undefined;
    apply_result(r: HttpResult): void;
}
