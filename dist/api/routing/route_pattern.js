import { raise } from "pimpanzee";
export class RoutePattern {
    path;
    regex;
    keys;
    static compile(path) {
        const keys = [];
        const source = RoutePattern.compile_path(path, keys);
        return new RoutePattern(path, new RegExp(`^${source}$`), keys);
    }
    constructor(path, regex, keys) {
        this.path = path;
        this.regex = regex;
        this.keys = keys;
    }
    match(pathname) {
        return this.regex.exec(pathname);
    }
    static compile_path(path, keys) {
        let pattern = "";
        for (let index = 0; index < path.length; index++) {
            const char = path[index] ?? raise("RoutePattern: missing character");
            if (char === ":") {
                const result = RoutePattern.read_key(path, index + 1);
                keys.push(result.key);
                pattern += "([^/]+)";
                index = result.index - 1;
            }
            else if (char === "*") {
                const result = RoutePattern.read_key(path, index + 1);
                keys.push(result.key);
                pattern += "(.*)";
                index = result.index - 1;
            }
            else {
                pattern += RoutePattern.escape_regex(char);
            }
        }
        return pattern;
    }
    static read_key(path, start) {
        let index = start;
        let key = "";
        while (index < path.length) {
            const char = path[index] ?? raise("RoutePattern: missing character");
            if (!/[A-Za-z0-9_]/.test(char)) {
                break;
            }
            key += char;
            index++;
        }
        if (key.length === 0) {
            raise(`Route path contains an unnamed parameter: ${path}`);
        }
        return { key, index };
    }
    static escape_regex(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
}
