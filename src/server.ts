import { createServer, type IncomingMessage, type Server as NodeServer, type ServerResponse } from "node:http"
import type { Handler } from "./handlers/handler.js"
import { HttpContext } from "./http/context.js"
import { HttpRequest, HttpResponse } from "./http/http.js"

export type ServerOptions<C extends HttpContext> = {
  create_context?: (request: HttpRequest, response: HttpResponse) => C
  handler: Handler<C>
}

export class Server<C extends HttpContext = HttpContext> {
  readonly server: NodeServer
  readonly handler: Handler<C>

  constructor(readonly port: number, readonly options: ServerOptions<C>) {
    this.server = createServer((req, res) => this.handle_request(req, res))
    this.handler = options.handler
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
}
