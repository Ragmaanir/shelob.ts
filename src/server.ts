import { createServer, type IncomingMessage, type Server as NodeServer, type ServerResponse } from "node:http"
import { Router } from "./api/router.js"
import { ErrorHandler } from "./handlers/error_handler.js"
import { Handler } from "./handlers/handler.js"
import { LogHandler } from "./handlers/log_handler.js"
import { RouterHandler } from "./handlers/router_handler.js"
import { HttpContext } from "./http/context.js"
import { HttpRequest, HttpResponse } from "./http/http.js"

export type ServerOptions<C extends HttpContext> = {
  create_context?: (request: HttpRequest, response: HttpResponse) => C
  error_handler?: ErrorHandler<C>
  handler?: Handler<C>
  handlers?: Handler<C>[]
  log_handler?: LogHandler<C>
  router?: Router<C>
  show_internal_exceptions?: boolean
}

export class Server<C extends HttpContext = HttpContext> {
  readonly server: NodeServer
  readonly router: Router<C>
  readonly handler: Handler<C>

  constructor(readonly port: number, readonly options: ServerOptions<C> = {}) {
    this.server = createServer((req, res) => this.handle_request(req, res))
    this.router = options.router ?? new Router<C>()
    this.handler = options.handler ?? this.build_handler_chain(options)
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`Server running at http://localhost:${this.port}/`)
    })
  }

  private async handle_request(raw_req: IncomingMessage, raw_res: ServerResponse) {
    const req = new HttpRequest(raw_req)
    const res = new HttpResponse(raw_res)
    const ctx = this.create_context(req, res)
    const result = await this.handler.call(ctx)

    ctx.apply_result(result)
  }

  private create_context(request: HttpRequest, response: HttpResponse): C {
    return this.options.create_context?.(request, response) ?? new HttpContext(request, response) as C
  }

  private build_handler_chain(options: ServerOptions<C>): Handler<C> {
    const handlers = options.handlers ?? [
      options.log_handler ?? new LogHandler<C>(),
      options.error_handler ?? new ErrorHandler<C>({ verbose: options.show_internal_exceptions })
    ]

    return Handler.chain(handlers, new RouterHandler(this.router))
  }
}
