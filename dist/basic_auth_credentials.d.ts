import type { HttpRequest } from "./http/http.js";
export declare class BasicAuthCredentials {
    readonly user: string;
    readonly password: string;
    static from_request(request: HttpRequest): BasicAuthCredentials | null;
    static from_header(header: string | null): BasicAuthCredentials | null;
    constructor(user: string, password: string);
    equals(other: BasicAuthCredentials | null): boolean;
    authenticated(request: HttpRequest): boolean;
}
