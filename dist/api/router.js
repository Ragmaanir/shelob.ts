import { RequestMethod } from "../http/request_method.js";
class Route {
    method;
    path;
    path_params;
    matcher;
    constructor(method, path, 
    // readonly path_params: Map<string, string | null>
    path_params, matcher) {
        this.method = method;
        this.path = path;
        this.path_params = path_params;
        this.matcher = matcher;
    }
}
class RouteMatcher {
    method;
    path;
    keys;
    handler;
    static build(method, path, handler) {
        // Convert "/users/:id" to regex and extract keys
        const keys = [];
        const pattern = path.replace(/:([A-Za-z0-9_]+)/g, (_, key) => {
            keys.push(key);
            return "([^/]+)";
        });
        const regex = new RegExp(`^${pattern}$`);
        return new RouteMatcher(method, regex, keys, handler);
    }
    constructor(method, path, keys, handler) {
        this.method = method;
        this.path = path;
        this.keys = keys;
        this.handler = handler;
    }
}
export class Router {
    routes = [];
    get(path, handler) {
        this.add(RequestMethod.GET, path, handler);
    }
    post(path, handler) {
        this.add(RequestMethod.POST, path, handler);
    }
    delete(path, handler) {
        this.add(RequestMethod.DELETE, path, handler);
    }
    add(method, path, handler) {
        this.routes.push(RouteMatcher.build(method, path, handler));
    }
    find_route(method, url) {
        const pathname = url.split("?")[0] ?? "";
        for (const r of this.routes) {
            if (method === r.method) {
                const match = r.path.exec(pathname);
                if (match) {
                    const path_params = Object.fromEntries(r.keys.map((k, i) => [k, match[i + 1]]));
                    return new Route(method, pathname, path_params, r);
                }
            }
        }
        return null;
    }
    route(ctx) {
        const r = this.find_route(ctx.request.method, ctx.request.url ?? "");
        if (r) {
            return r.matcher.handler(ctx, r.path_params);
        }
        return null;
    }
}
