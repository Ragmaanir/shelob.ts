import { raise } from "pimpanzee";
import { RequestMethod } from "../../http/request_method.js";
import { Router } from "./router.js";
export class RouterBuilder {
    static build(build) {
        const builder = new RouterBuilder();
        build(builder);
        return builder.result();
    }
    router = new Router();
    current_path = [];
    scope(path, build) {
        this.current_path.push(path.toString());
        try {
            build(this);
        }
        finally {
            this.current_path.pop();
        }
    }
    resources(path, routes, build = null) {
        this.scope(path, () => {
            if (routes.index) {
                this.get(routes.index);
            }
            if (routes.create) {
                this.post(routes.create);
            }
            if (routes.show) {
                this.get(":id", routes.show);
            }
            if (routes.update) {
                this.put(":id", routes.update);
            }
            if (routes.destroy) {
                this.delete(":id", routes.destroy);
            }
            if (build) {
                build(this);
            }
        });
    }
    match(path_or_methods, methods_or_target, target = null) {
        if (Array.isArray(path_or_methods)) {
            this.router.match(path_or_methods, this.build_path(null), route_action(methods_or_target));
        }
        else {
            this.router.match(methods_or_target, this.build_path(path_or_methods.toString()), route_action(target ?? raise("RouterBuilder: missing route target")));
        }
    }
    head(path_or_target, target = null) {
        this.add(RequestMethod.HEAD, path_or_target, target);
    }
    get(path_or_target, target = null) {
        this.add(RequestMethod.GET, path_or_target, target);
    }
    post(path_or_target, target = null) {
        this.add(RequestMethod.POST, path_or_target, target);
    }
    put(path_or_target, target = null) {
        this.add(RequestMethod.PUT, path_or_target, target);
    }
    patch(path_or_target, target = null) {
        this.add(RequestMethod.PATCH, path_or_target, target);
    }
    delete(path_or_target, target = null) {
        this.add(RequestMethod.DELETE, path_or_target, target);
    }
    result() {
        return this.router;
    }
    add(method, path_or_target, target) {
        if (target) {
            this.router.match([method], this.build_path(path_or_target.toString()), route_action(target));
        }
        else {
            this.router.match([method], this.build_path(null), route_action(path_or_target));
        }
    }
    build_path(path) {
        return Router.normalize_path([...this.current_path, path].filter((segment) => segment !== null).join("/"));
    }
}
function route_action(target) {
    if (is_endpoint_constructor(target)) {
        return (ctx, route) => new target(ctx, route).call();
    }
    return target;
}
function is_endpoint_constructor(target) {
    return "prototype" in target && "call" in target.prototype;
}
