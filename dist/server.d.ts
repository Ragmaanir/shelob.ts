import { type Server as NodeServer } from "node:http";
import type { Handler } from "./handlers/handler.js";
import { HttpContext } from "./http/context.js";
import { HttpRequest, HttpResponse } from "./http/http.js";
export type ServerOptions<C extends HttpContext> = {
    create_context?: (request: HttpRequest, response: HttpResponse) => C;
    handler: Handler<C>;
};
export declare class Server<C extends HttpContext = HttpContext> {
    readonly port: number;
    readonly options: ServerOptions<C>;
    readonly server: NodeServer;
    readonly handler: Handler<C>;
    constructor(port: number, options: ServerOptions<C>);
    start(): void;
    private handle_request;
    private create_context;
}
