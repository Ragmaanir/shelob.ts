import { RGB, raise } from "pimpanzee";
import { RequestMethod } from "../http/request_method.js";
import { StatusKind } from "../http/status.js";
import { Handler } from "./handler.js";
const INFORMATIONAL_FG = new RGB(80, 80, 200);
const SUCCESS_FG = new RGB(80, 200, 80);
const REDIRECTION_FG = new RGB(80, 200, 200);
const CLIENT_ERROR_FG = new RGB(200, 200, 80);
const SERVER_ERROR_FG = new RGB(200, 80, 80);
export class LogHandler extends Handler {
    options;
    constructor(options = {}) {
        super();
        this.options = options;
    }
    async call(context) {
        const result = await this.call_next(context);
        this.log(context.request, result);
        return result;
    }
    log(request, result) {
        console.log(this.message(request, result));
    }
    message(request, result) {
        return [
            this.remote_address(request),
            this.http_version(request),
            "-",
            this.elapsed_text(request.time_passed()),
            "-",
            this.colored_status(result.status),
            "-",
            this.colored_method(request.method),
            this.colored_path(request.url ?? "")
        ].join(" ");
    }
    remote_address(request) {
        return request.req.socket.remoteAddress ?? "-";
    }
    http_version(request) {
        return this.rgb(150, 150, 150)(`HTTP/${request.req.httpVersion}`);
    }
    colored_path(path) {
        return this.rgb(220, 220, 0)(path);
    }
    colored_method(method) {
        return this.http_method_color(method)(method);
    }
    http_method_color(method) {
        switch (method) {
            case RequestMethod.GET: return this.rgb(100, 250, 100);
            case RequestMethod.HEAD: return this.rgb(250, 100, 100);
            case RequestMethod.POST:
            case RequestMethod.PUT:
            case RequestMethod.PATCH:
                return this.rgb(200, 100, 100);
            case RequestMethod.DELETE: return this.rgb(250, 50, 50);
            default: return this.rgb(200, 100, 150);
        }
    }
    status_color(status) {
        switch (status.kind) {
            case StatusKind.INFO: return this.color(INFORMATIONAL_FG);
            case StatusKind.SUCCESS: return this.color(SUCCESS_FG);
            case StatusKind.REDIRECT: return this.color(REDIRECTION_FG);
            case StatusKind.CLIENT_ERROR: return this.color(CLIENT_ERROR_FG);
            case StatusKind.SERVER_ERROR: return this.color(SERVER_ERROR_FG);
            default: raise(`Invalid status kind: ${status.kind}`);
        }
    }
    colored_status(status) {
        return this.status_color(status)(String(status.code));
    }
    elapsed_text(ms) {
        const text = this.format_elapsed(ms);
        return this.elapsed_color(ms)(text.padStart(4, " "));
    }
    format_elapsed(ms) {
        if (ms < 1) {
            return `${Math.round(ms * 1000)}u`;
        }
        if (ms < 1000) {
            return `${Math.round(ms)}m`;
        }
        if (ms < 10000) {
            return `${Number((ms / 1000).toFixed(1))}s`;
        }
        return `${Math.round(ms / 1000)}s`;
    }
    elapsed_color(ms) {
        const seconds = ms / 1000;
        if (seconds > 5.0)
            return this.rgb(200, 50, 50);
        if (seconds > 1.0)
            return this.rgb(200, 100, 100);
        if (seconds > 0.5)
            return this.rgb(200, 150, 50);
        if (seconds > 0.1)
            return this.rgb(100, 150, 100);
        return this.rgb(50, 200, 50);
    }
    rgb(red, green, blue) {
        return this.color(new RGB(red, green, blue));
    }
    color(color) {
        return text => color.fg(text, this.options.colors_enabled ?? true);
    }
}
