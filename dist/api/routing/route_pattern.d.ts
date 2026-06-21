export declare class RoutePattern {
    readonly path: string;
    readonly regex: RegExp;
    readonly keys: string[];
    static compile(path: string): RoutePattern;
    private constructor();
    match(pathname: string): RegExpExecArray | null;
    private static compile_path;
    private static read_key;
    private static escape_regex;
}
