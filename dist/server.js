import { createServer } from "node:http";
import { HttpContext } from "./http/context.js";
import { HttpRequest, HttpResponse } from "./http/http.js";
export class Server {
    port;
    options;
    server;
    handler;
    constructor(port, options) {
        this.port = port;
        this.options = options;
        this.server = createServer((req, res) => this.handle_request(req, res));
        this.handler = options.handler;
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
        ctx.apply_result(result, (error) => this.log_internal_error(error));
    }
    create_context(request, response) {
        return this.options.create_context?.(request, response) ?? new HttpContext(request, response);
    }
    log_internal_error(error) {
        console.error("Internal error", error);
    }
}
