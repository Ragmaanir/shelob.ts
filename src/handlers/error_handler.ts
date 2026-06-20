import { RGB, ValidationException } from "pimpanzee"
import type { HttpContext } from "../http/context.js"
import { HttpResult } from "../http/result.js"
import { ServerExceptionResponse } from "../http/server_exception_response.js"
import { HttpStatuses } from "../http/status.js"
import { Handler } from "./handler.js"

export class ErrorHandler<C extends HttpContext = HttpContext> extends Handler<C> {
  constructor(readonly options: { verbose?: boolean } = {}) {
    super()
  }

  async call(context: C): Promise<HttpResult> {
    try {
      return await this.call_next(context)
    } catch (e) {
      this.log(e)
      return this.result(e)
    }
  }

  log(e: unknown) {
    if (e instanceof ValidationException) {
      console.error(RGB.RED.fg("ValidationException"))
      console.error(RGB.RED.fg(e.error.toString()))
    } else if (e instanceof Error) {
      console.error(`Error(${e.constructor.name})`)
      console.error(e.stack)
    } else {
      console.error(e)
    }
  }

  result(e: unknown): HttpResult {
    if (!this.options.verbose) {
      return HttpResult.status(HttpStatuses.INTERNAL_ERROR)
    }

    if (e instanceof ValidationException) {
      const body = {
        exception: {
          name: e.constructor.name,
          message: String(e.message ?? "Validation failed")
        },
        validation_error: e.error
      }

      return HttpResult.error_json(body, HttpStatuses.UNPROCESSABLE_ENTITY)
    }

    if (e instanceof Error) {
      const response = ServerExceptionResponse.from_exception(e)

      return HttpResult.json(response.to_json(), HttpStatuses.INTERNAL_ERROR)
    }

    const response = new ServerExceptionResponse("UnknownError", String(e), "", [])

    return HttpResult.json(response.to_json(), HttpStatuses.INTERNAL_ERROR)
  }
}
