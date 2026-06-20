import { raise } from "pimpanzee";
export class Endpoint {
    ctx;
    params;
    constructor(ctx, params) {
        this.ctx = ctx;
        this.params = params;
    }
    fetch_param(param_name) {
        return this.params[param_name] ?? raise(`Param missing: ${param_name}`);
    }
    fetch_int(param_name) {
        const value = this.fetch_param(param_name);
        if (!/^[+-]?\d+$/.test(value)) {
            return null;
        }
        return Number.parseInt(value, 10);
    }
}
