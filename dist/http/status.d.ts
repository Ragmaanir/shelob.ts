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
    NOT_FOUND: HttpStatus;
    UNPROCESSABLE_ENTITY: HttpStatus;
    METHOD_NOT_ALLOWED: HttpStatus;
    INTERNAL_ERROR: HttpStatus;
};
