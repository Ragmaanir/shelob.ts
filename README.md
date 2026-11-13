# 🕸️ shelob.ts

### Version 1.0.0

A small TypeScript HTTP framework for Node.js. Give each API action an endpoint class, register the class on a route, and return an `HttpResult` from its `call()` method.

## Installation

Install Shelob and its peer dependency, `pimpanzee`.

```sh
pnpm add github:Ragmaanir/shelob.ts github:Ragmaanir/pimpanzee
```

## Usage

Save this as `server.mts`. This blog API lists posts at `/api/posts` and serves individual posts by slug. Both endpoints read the posts from the request context. For each matching request, `RouterBuilder` constructs the registered endpoint with the context and matched route, then invokes its instance method `call()`.

```ts
import {
  ApiContext, Endpoint, type HttpRequest, HttpResult, type HttpResponse,
  HttpStatuses, RouterBuilder, RouterHandler, Server
} from "shelob.ts"

type Post = { slug: string, title: string }

class BlogContext extends ApiContext {
  readonly posts: Post[]

  constructor(request: HttpRequest, response: HttpResponse, posts: Post[]) {
    super(request, response)
    this.posts = posts
  }
}

class PostsIndex extends Endpoint<BlogContext> {
  override call() {
    return HttpResult.json(this.ctx.posts)
  }
}

class PostGet extends Endpoint<BlogContext> {
  override call() {
    const slug = this.fetch_param("slug")
    const post = this.ctx.posts.find(post => post.slug === slug)
    if (!post) return HttpResult.status(HttpStatuses.NOT_FOUND)
    return HttpResult.json(post)
  }
}

const router = RouterBuilder.build<BlogContext>(routes => {
  routes.scope("/api", api => {
    api.get("/posts", PostsIndex)
    api.get("/posts/:slug", PostGet)
  })
})

const posts = [{ slug: "hello-world", title: "Hello, world!" }]
const handler = new RouterHandler(router)
new Server(3000, {
  handler,
  create_context: (request, response) => new BlogContext(request, response, posts)
}).start()
```

Start it with `node server.mts` on Node.js 26 LTS. In another terminal, fetch the post by its slug.

```console
$ curl -s http://localhost:3000/api/posts/hello-world
{"slug":"hello-world","title":"Hello, world!"}
```

## Routing

- `scope("/api", ...)` prefixes the paths declared inside the callback.
- Use `:slug` to capture one path segment or `*path` to capture the rest of a path. Routes match in declaration order, so put specific paths before wildcards.
- Use `resources("posts", { index, create, show, update, destroy })` for resource routes. Supply only the actions you implement. `show`, `update`, and `destroy` receive an `:id` path parameter.
- An endpoint can implement `async call()` when it needs to await a database query or read `this.ctx.request.body_as_json`. Use `HttpResult.json` for JSON, `HttpResult.html` for HTML, and `HttpResult.file` for a file stream.
- Inline callbacks also work for small routes, for example `api.get("/health", () => HttpResult.ok())`.

### Using an endpoint with `Router`

The lower-level `Router` accepts route functions. To register `PostGet` with it, import the `Route` type from `shelob.ts` and add this static method to `PostGet`.

```ts
static call(ctx: BlogContext, route: Route) {
  return new PostGet(ctx, route).call()
}
```

Register the function with `router.get("/api/posts/:slug", PostGet.call)` on a `new Router<BlogContext>()`.

## Handlers

To add request logging and error handling, import `Handler`, `LogHandler`, and `ErrorHandler` from `shelob.ts` and replace the `const handler` declaration above.

```ts
const handler = Handler.chain<BlogContext>(
  [new LogHandler<BlogContext>(), new ErrorHandler<BlogContext>()],
  new RouterHandler(router)
)
```

Requests enter the handlers in array order. Here `ErrorHandler` turns an exception from a route into a 500 response, and `LogHandler` logs the resulting status. An unmatched route returns 404.

## Development

Run `pnpm install` in this repository, then `pnpm test` to type-check and run the tests. Use `pnpm build` to regenerate `dist/`.
