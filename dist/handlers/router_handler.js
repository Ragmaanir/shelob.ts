import { HttpResult } from "../http/result.js";
import { HttpStatuses } from "../http/status.js";
import { Handler } from "./handler.js";
export class RouterHandler extends Handler {
    router;
    constructor(router) {
        super();
        this.router = router;
    }
    call(context) {
        return this.router.route(context) ?? Promise.resolve(HttpResult.status(HttpStatuses.NOT_FOUND));
    }
}
