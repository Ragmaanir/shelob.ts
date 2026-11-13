# 🕸️ shelob.ts

### Version 1.0.0

A small TypeScript HTTP framework for Node.js. Give each API action an endpoint class, register the class on a route, and return an `HttpResult` from its `call()` method.

## Installation

Install Shelob and its peer dependency, `pimpanzee`.

```sh
pnpm add github:Ragmaanir/shelob.ts github:Ragmaanir/pimpanzee
```

## Usage

Save this as `server.mts`. The two endpoints share a pump list through the request context. For each matching request, `RouterBuilder` constructs the registered endpoint with the context and matched route, then invokes its instance method `call()`.

```ts
import {
  ApiContext, Endpoint, type HttpRequest, HttpResult, type HttpResponse,
  HttpStatuses, RouterBuilder, RouterHandler, Server
} from "shelob.ts"

type Pump = { name: string, speed: number }

class PumpContext extends ApiContext {
  readonly pumps: Pump[]

  constructor(request: HttpRequest, response: HttpResponse, pumps: Pump[]) {
    super(request, response)
    this.pumps = pumps
  }
}

class PumpsIndex extends Endpoint<PumpContext> {
  override call() {
    return HttpResult.json(this.ctx.pumps)
  }
}

class PumpGet extends Endpoint<PumpContext> {
  override call() {
    const name = this.fetch_param("name")
    const pump = this.ctx.pumps.find(pump => pump.name === name)
    if (!pump) return HttpResult.status(HttpStatuses.NOT_FOUND)
    return HttpResult.json(pump)
  }
}

const router = RouterBuilder.build<PumpContext>(routes => {
  routes.scope("/api", api => {
    api.get("/pumps", PumpsIndex)
    api.get("/pumps/:name", PumpGet)
  })
})

const pumps = [{ name: "main", speed: 10 }]
const handler = new RouterHandler(router)
new Server(3000, {
  handler,
  create_context: (request, response) => new PumpContext(request, response, pumps)
}).start()
```

Start it with `node server.mts` on Node.js 26 LTS. In another terminal, request the main pump.

```console
$ curl -s http://localhost:3000/api/pumps/main
{"name":"main","speed":10}
```

## Routing

- `scope("/api", ...)` prefixes the paths declared inside the callback.
- Use `:name` to capture one path segment or `*path` to capture the rest of a path. Routes match in declaration order, so put specific paths before wildcards.
- Use `resources("pumps", { index, create, show, update, destroy })` for resource routes. Supply only the actions you implement. `show`, `update`, and `destroy` receive an `:id` path parameter.
- An endpoint can implement `async call()` when it needs to await a database query or read `this.ctx.request.body_as_json`. Use `HttpResult.json` for JSON, `HttpResult.html` for HTML, and `HttpResult.file` for a file stream.
- Inline callbacks also work for small routes, for example `api.get("/health", () => HttpResult.ok())`.

### Using an endpoint with `Router`

The lower-level `Router` accepts route functions. Bizkit uses this API and gives each endpoint a static `call` method that constructs the endpoint and delegates to the instance. To use this pattern with `PumpGet`, import the `Route` type from `shelob.ts` and add this method to the class.

```ts
static call(ctx: PumpContext, route: Route) {
  return new PumpGet(ctx, route).call()
}
```

Register the function with `router.get("/api/pumps/:name", PumpGet.call)` on a `new Router<PumpContext>()`.

## Handlers

To add request logging and error handling, import `Handler`, `LogHandler`, and `ErrorHandler` from `shelob.ts` and replace the `const handler` declaration above.

```ts
const handler = Handler.chain<PumpContext>(
  [new LogHandler<PumpContext>(), new ErrorHandler<PumpContext>()],
  new RouterHandler(router)
)
```

Requests enter the handlers in array order. Here `ErrorHandler` turns an exception from a route into a 500 response, and `LogHandler` logs the resulting status. An unmatched route returns 404.

## Development

Run `pnpm install` in this repository, then `pnpm test` to type-check and run the tests. Use `pnpm build` to regenerate `dist/`.
