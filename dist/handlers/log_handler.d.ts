import type { HttpContext } from "../http/context.js";
import type { HttpRequest } from "../http/http.js";
import type { HttpResult } from "../http/result.js";
import { Handler } from "./handler.js";
export declare class LogHandler<C extends HttpContext = HttpContext> extends Handler<C> {
    readonly options: {
        colors_enabled?: boolean;
    };
    constructor(options?: {
        colors_enabled?: boolean;
    });
    call(context: C): Promise<HttpResult>;
    log(request: HttpRequest, result: HttpResult): void;
    message(request: HttpRequest, result: HttpResult): string;
    private remote_address;
    private http_version;
    private colored_path;
    private colored_method;
    private http_method_color;
    private status_color;
    private colored_status;
    private elapsed_text;
    private format_elapsed;
    private elapsed_color;
    private rgb;
    private color;
}
