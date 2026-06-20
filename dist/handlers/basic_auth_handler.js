import { HttpResult } from "../http/result.js";
import { HttpStatuses } from "../http/status.js";
import { Handler } from "./handler.js";
export class BasicAuthHandler extends Handler {
    basic_auth;
    realm;
    constructor(basic_auth, realm) {
        super();
        this.basic_auth = basic_auth;
        this.realm = realm;
    }
    call(context) {
        if (!this.basic_auth || this.basic_auth.authenticated(context.request)) {
            return this.call_next(context);
        }
        return Promise.resolve(new HttpResult(HttpStatuses.UNAUTHORIZED, "HTTP 401 Unauthorized", new Map([["WWW-Authenticate", `Basic realm="${this.realm}"`]])));
    }
}
