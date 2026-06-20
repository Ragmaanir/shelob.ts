import { ReadStream } from "node:fs";
export class HttpContext {
    request;
    response;
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }
    get method() {
        return this.request.method;
    }
    get url() {
        return this.request.url;
    }
    apply_result(r) {
        const res = this.response.raw;
        res.setHeaders(r.headers);
        res.statusCode = r.status.code;
        const c = r.content;
        if (c instanceof ReadStream) {
            c.pipe(res);
            c.on("error", (e) => {
                console.log(e); // TODO: logging
                res.statusCode = 500;
                res.end("Error piping stream");
            });
        }
        else {
            res.end(c);
        }
    }
}
