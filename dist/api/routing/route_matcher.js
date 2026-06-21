import { raise } from "pimpanzee";
import { Route } from "./route.js";
import { RoutePattern } from "./route_pattern.js";
export class RouteMatch {
    route;
    matcher;
    constructor(route, matcher) {
        this.route = route;
        this.matcher = matcher;
    }
}
export class RouteMatcher {
    method;
    pattern;
    action;
    static build(method, path, action) {
        return new RouteMatcher(method, RoutePattern.compile(path), action);
    }
    constructor(method, pattern, action) {
        this.method = method;
        this.pattern = pattern;
        this.action = action;
    }
    match(method, pathname) {
        if (method !== this.method) {
            return null;
        }
        const match = this.pattern.match(pathname);
        if (!match) {
            return null;
        }
        const path_params = {};
        for (let index = 0; index < this.pattern.keys.length; index++) {
            const key = this.pattern.keys.at(index) ?? raise("RouteMatcher: missing key");
            const value = match.at(index + 1) ?? null;
            if (value !== null) {
                path_params[key] = decodeURIComponent(value);
            }
        }
        return new RouteMatch(new Route(method, pathname, path_params), this);
    }
}
