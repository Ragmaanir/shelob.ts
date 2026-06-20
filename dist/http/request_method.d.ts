export declare enum RequestMethod {
    GET = "GET",
    HEAD = "HEAD",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE"
}
export declare namespace RequestMethod {
    function parse(s: string): RequestMethod;
}
