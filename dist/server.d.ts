import { type Server as NodeServer } from "node:http";
import { Router } from "./api/router.js";
import { HttpContext } from "./http/context.js";
import { HttpRequest, HttpResponse } from "./http/http.js";
export type ServerOptions<C extends HttpContext> = {
    create_context?: (request: HttpRequest, response: HttpResponse) => C;
    router?: Router<C>;
    show_internal_exceptions?: boolean;
};
export declare class Server<C extends HttpContext = HttpContext> {
    readonly port: number;
    readonly options: ServerOptions<C>;
    readonly server: NodeServer;
    readonly router: Router<C>;
    constructor(port: number, options?: ServerOptions<C>);
    start(): void;
    private handle_request;
    private create_context;
    private process_request;
    private log_error;
    private internal_error_result;
}
