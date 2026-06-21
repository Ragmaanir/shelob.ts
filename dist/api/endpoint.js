export class Endpoint {
    ctx;
    route;
    constructor(ctx, route) {
        this.ctx = ctx;
        this.route = route;
    }
    fetch_param(param_name) {
        return this.route.fetch_param(param_name);
    }
    fetch_int(param_name) {
        return this.route.fetch_int(param_name);
    }
}
