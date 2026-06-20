import { MIMES } from "./mime.js";
import { HttpStatuses } from "./status.js";
export class HttpResult {
    status;
    content;
    headers;
    static ok() {
        return new HttpResult(HttpStatuses.OK, "", new Map());
    }
    static status(s) {
        return new HttpResult(s, "", new Map());
    }
    static json(json, status = HttpStatuses.OK) {
        return new HttpResult(status, JSON.stringify(json), new Map([["Content-Type", MIMES.JSON.value]]));
    }
    static raw_json(json, status = HttpStatuses.OK) {
        return new HttpResult(status, json, new Map([["Content-Type", MIMES.JSON.value]]));
    }
    static error_json(json, status) {
        return new HttpResult(status, JSON.stringify(json), new Map([["Content-Type", MIMES.JSON.value]]));
    }
    static html(s) {
        return new HttpResult(HttpStatuses.OK, s, new Map([["Content-Type", MIMES.HTML.value]]));
    }
    static file(s, mime) {
        return new HttpResult(HttpStatuses.OK, s, new Map([["Content-Type", mime.value]]));
    }
    constructor(status, content, headers) {
        this.status = status;
        this.content = content;
        this.headers = headers;
    }
}
