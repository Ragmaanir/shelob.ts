import { raise } from "pimpanzee"
import type { HttpResult } from "../http/result.js"
import type { ApiContext } from "./context.js"
import type { HttpParams } from "./router.js"

export abstract class Endpoint<C extends ApiContext> {
  constructor(readonly ctx: C, readonly params: HttpParams) { }

  abstract call(): Promise<HttpResult>

  protected fetch_param(param_name: string): string {
    return this.params[param_name] ?? raise(`Param missing: ${param_name}`)
  }

  protected fetch_int(param_name: string): number | null {
    const value = this.fetch_param(param_name)

    if (!/^[+-]?\d+$/.test(value)) {
      return null
    }

    return Number.parseInt(value, 10)
  }
}
