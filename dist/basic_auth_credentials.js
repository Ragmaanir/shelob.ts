const BASE_64_CHARSET = /^[a-zA-Z0-9+/]*={0,2}$/;
export class BasicAuthCredentials {
    user;
    password;
    static from_request(request) {
        return BasicAuthCredentials.from_header(request.basic_auth_header());
    }
    static from_header(header) {
        if (!header) {
            return null;
        }
        const match = /^Basic (.+)$/.exec(header);
        if (!match || !BASE_64_CHARSET.test(match[1] ?? "")) {
            return null;
        }
        const decoded = Buffer.from(match[1] ?? "", "base64").toString("utf8");
        const separator = decoded.indexOf(":");
        if (separator < 0) {
            return null;
        }
        return new BasicAuthCredentials(decoded.slice(0, separator), decoded.slice(separator + 1));
    }
    constructor(user, password) {
        this.user = user;
        this.password = password;
    }
    equals(other) {
        return other !== null && this.user === other.user && this.password === other.password;
    }
    authenticated(request) {
        return this.equals(BasicAuthCredentials.from_request(request));
    }
}
