import { RequestMethod } from "../../http/request_method.js";
import { RouteMatcher } from "./route_matcher.js";
export class Router {
    static normalize_path(path) {
        const segments = path.split("/").filter((segment) => segment.length > 0);
        if (segments.length === 0) {
            return "/";
        }
        return `/${segments.join("/")}`;
    }
    routes = [];
    head(path, action) {
        this.add(RequestMethod.HEAD, path, action);
    }
    get(path, action) {
        this.add(RequestMethod.GET, path, action);
    }
    post(path, action) {
        this.add(RequestMethod.POST, path, action);
    }
    put(path, action) {
        this.add(RequestMethod.PUT, path, action);
    }
    patch(path, action) {
        this.add(RequestMethod.PATCH, path, action);
    }
    delete(path, action) {
        this.add(RequestMethod.DELETE, path, action);
    }
    match(methods, path, action) {
        for (const method of methods) {
            this.add(method, path, action);
        }
    }
    add(method, path, action) {
        this.routes.push(RouteMatcher.build(method, Router.normalize_path(path), action));
    }
    find_route(method, url) {
        return this.find_route_match(method, url)?.route ?? null;
    }
    route(ctx) {
        const match = this.find_route_match(ctx.request.method, ctx.request.url ?? "");
        if (match) {
            return Promise.resolve(match.matcher.action(ctx, match.route));
        }
        return null;
    }
    find_route_match(method, url) {
        const pathname = url.split("?").at(0) ?? "";
        const path = Router.normalize_path(pathname);
        for (const route of this.routes) {
            const match = route.match(method, path);
            if (match) {
                return match;
            }
        }
        return null;
    }
}
