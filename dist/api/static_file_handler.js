import { createReadStream, existsSync } from "node:fs";
import { extname, join } from "node:path";
import { MIMES, Mime } from "pimpanzee";
import { HttpResult } from "../http/result.js";
import { HttpStatuses } from "../http/status.js";
export class StaticFileHandler {
    root;
    constructor(root) {
        this.root = root;
    }
    call(ctx) {
        const filePath = join(this.root, decodeURIComponent(ctx.url || ""));
        if (existsSync(filePath)) {
            const ext = extname(filePath);
            const mime = Mime.from_extension(ext) || MIMES.OCTET;
            const stream = createReadStream(filePath);
            return HttpResult.file(stream, mime);
        }
        else {
            console.log(`File not found: ${filePath}`);
            return HttpResult.status(HttpStatuses.NOT_FOUND);
        }
    }
}
