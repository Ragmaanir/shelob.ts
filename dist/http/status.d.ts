export declare enum StatusKind {
    INFO = 100,
    SUCCESS = 200,
    REDIRECT = 300,
    CLIENT_ERROR = 400,
    SERVER_ERROR = 500
}
export declare class HttpStatus {
    readonly code: number;
    static NAMES: Map<number, string>;
    static from_code(code: number): HttpStatus;
    constructor(code: number);
    get success(): boolean;
    get name(): string;
    get full_message(): string;
    get kind(): StatusKind;
    get is_info(): boolean;
    get is_success(): boolean;
    get is_error(): boolean;
    get is_client_error(): boolean;
    get is_server_error(): boolean;
    get is_unprocessable_entity(): boolean;
    get is_validation_error(): boolean;
}
export declare const HttpStatuses: {
    OK: HttpStatus;
    CREATED: HttpStatus;
    ACCEPTED: HttpStatus;
    NO_CONTENT: HttpStatus;
    MOVED_PERMANENTLY: HttpStatus;
    FOUND: HttpStatus;
    NOT_MODIFIED: HttpStatus;
    BAD_REQUEST: HttpStatus;
    UNAUTHORIZED: HttpStatus;
    FORBIDDEN: HttpStatus;
    NOT_FOUND: HttpStatus;
    METHOD_NOT_ALLOWED: HttpStatus;
    CONFLICT: HttpStatus;
    UNSUPPORTED_MEDIA_TYPE: HttpStatus;
    UNPROCESSABLE_ENTITY: HttpStatus;
    TOO_MANY_REQUESTS: HttpStatus;
    INTERNAL_ERROR: HttpStatus;
    BAD_GATEWAY: HttpStatus;
    SERVICE_UNAVAILABLE: HttpStatus;
};
