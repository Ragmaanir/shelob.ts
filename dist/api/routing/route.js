import { raise } from "pimpanzee";
export class Route {
    method;
    path;
    path_params;
    constructor(method, path, path_params) {
        this.method = method;
        this.path = path;
        this.path_params = path_params;
    }
    param(param_name) {
        return this.path_params[param_name] ?? null;
    }
    fetch_param(param_name) {
        return this.param(param_name) ?? raise(`Param missing: ${param_name}`);
    }
    fetch_int(param_name) {
        const value = this.fetch_param(param_name);
        if (!/^[+-]?\d+$/.test(value)) {
            return null;
        }
        return Number.parseInt(value, 10);
    }
}
