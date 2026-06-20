import { createServer } from "node:http";
import { ValidationException } from "pimpanzee";
import { Router } from "./api/router.js";
import { HttpContext } from "./http/context.js";
import { HttpRequest, HttpResponse } from "./http/http.js";
import { HttpResult } from "./http/result.js";
import { ServerExceptionResponse } from "./http/server_exception_response.js";
import { HttpStatuses } from "./http/status.js";
export class Server {
    port;
    options;
    server;
    router;
    constructor(port, options = {}) {
        this.port = port;
        this.options = options;
        this.server = createServer((req, res) => this.handle_request(req, res));
        this.router = options.router ?? new Router();
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
        const result = await this.process_request(ctx);
        ctx.apply_result(result);
        res.raw.on("finish", () => {
            console.log(`${req.method.padEnd(4, " ")} ${req.time_passed().toString().padStart(2, " ")}ms ${result.status.code} ${req.url}`);
        });
    }
    create_context(request, response) {
        return this.options.create_context?.(request, response) ?? new HttpContext(request, response);
    }
    process_request(ctx) {
        try {
            const res = this.router.route(ctx);
            if (res) {
                return res.catch(e => {
                    this.log_error(e);
                    return this.internal_error_result(e);
                });
            }
            return Promise.resolve(HttpResult.status(HttpStatuses.NOT_FOUND));
        }
        catch (e) {
            this.log_error(e);
            return Promise.resolve(this.internal_error_result(e));
        }
    }
    log_error(e) {
        if (e instanceof ValidationException) {
            console.error("ValidationException");
            console.error(e.error.toString());
        }
        else if (e instanceof Error) {
            console.error(`Error(${e.constructor.name})`);
            console.error(e.stack);
        }
        else {
            console.error(e);
        }
    }
    internal_error_result(e) {
        if (!this.options.show_internal_exceptions) {
            return HttpResult.status(HttpStatuses.INTERNAL_ERROR);
        }
        if (e instanceof ValidationException) {
            const body = {
                exception: {
                    name: e.constructor.name,
                    message: String(e.message ?? "Validation failed")
                },
                validation_error: e.error
            };
            return HttpResult.error_json(body, HttpStatuses.UNPROCESSABLE_ENTITY);
        }
        if (e instanceof Error) {
            const response = ServerExceptionResponse.from_exception(e);
            return HttpResult.json(response.to_json(), HttpStatuses.INTERNAL_ERROR);
        }
        const response = new ServerExceptionResponse("UnknownError", String(e), "", []);
        return HttpResult.json(response.to_json(), HttpStatuses.INTERNAL_ERROR);
    }
}
