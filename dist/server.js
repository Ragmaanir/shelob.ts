import { createServer } from "node:http";
import { Router } from "./api/router.js";
import { ErrorHandler } from "./handlers/error_handler.js";
import { Handler } from "./handlers/handler.js";
import { LogHandler } from "./handlers/log_handler.js";
import { RouterHandler } from "./handlers/router_handler.js";
import { HttpContext } from "./http/context.js";
import { HttpRequest, HttpResponse } from "./http/http.js";
export class Server {
    port;
    options;
    server;
    router;
    handler;
    constructor(port, options = {}) {
        this.port = port;
        this.options = options;
        this.server = createServer((req, res) => this.handle_request(req, res));
        this.router = options.router ?? new Router();
        this.handler = options.handler ?? this.build_handler_chain(options);
    }
    start() {
        this.server.listen(this.port, () => {
            console.log(`Server running at http://localhost:${this.port}/`);
        });
    }
    async handle_request(raw_req, raw_res) {
        const req = new HttpRequest(raw_req);
        const res = new HttpResponse(raw_res);
        const ctx = this.create_context(req, res);
        const result = await this.handler.call(ctx);
        ctx.apply_result(result);
    }
    create_context(request, response) {
        return this.options.create_context?.(request, response) ?? new HttpContext(request, response);
    }
    build_handler_chain(options) {
        const handlers = options.handlers ?? [
            options.log_handler ?? new LogHandler(),
            options.error_handler ?? new ErrorHandler({ verbose: options.show_internal_exceptions })
        ];
        return Handler.chain(handlers, new RouterHandler(this.router));
    }
}
