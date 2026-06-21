import type { IncomingMessage, ServerResponse } from "node:http"
import { assert, suite, test } from "microtest"
import { ApiContext } from "../../../src/api/context.js"
import { Endpoint } from "../../../src/api/endpoint.js"
import { RouterBuilder } from "../../../src/api/routing/router_builder.js"
import { HttpRequest, HttpResponse } from "../../../src/http/http.js"
import { RequestMethod } from "../../../src/http/request_method.js"
import { HttpResult } from "../../../src/http/result.js"

class TestContext extends ApiContext {
  readonly values: string[] = []
}

class UsersShow extends Endpoint<TestContext> {
  call(): Promise<HttpResult> {
    this.ctx.values.push(`Show(${this.fetch_param("id")})`)

    return Promise.resolve(HttpResult.ok())
  }
}

class UsersCreate extends Endpoint<TestContext> {
  call(): Promise<HttpResult> {
    this.ctx.values.push("Create")

    return Promise.resolve(HttpResult.ok())
  }
}

function context(method: RequestMethod, url: string): TestContext {
  const request = new HttpRequest({ method, url, headers: {}, socket: {} } as unknown as IncomingMessage)

  return new TestContext(request, new HttpResponse({} as unknown as ServerResponse))
}

suite("RouterBuilder", () => {
  test("builds resource routes with endpoint classes", async () => {
    const router = RouterBuilder.build<TestContext>((r) => {
      r.resources("users", {
        create: UsersCreate,
        show: UsersShow
      })
    })

    const show_context = context(RequestMethod.GET, "/users/1")
    const show_result = await router.route(show_context)

    assert.ok(show_result)
    assert.equal(show_context.values.join(","), "Show(1)")

    const create_context = context(RequestMethod.POST, "/users")
    const create_result = await router.route(create_context)

    assert.ok(create_result)
    assert.equal(create_context.values.join(","), "Create")
  })

  test("builds scoped inline routes", async () => {
    const router = RouterBuilder.build<TestContext>((r) => {
      r.scope("api", (api) => {
        api.get("tables/:id", (ctx, route) => {
          ctx.values.push(route.fetch_param("id"))

          return Promise.resolve(HttpResult.ok())
        })
      })
    })

    const ctx = context(RequestMethod.GET, "/api/tables/13")
    const result = await router.route(ctx)

    assert.ok(result)
    assert.equal(ctx.values.join(","), "13")
  })

  test("builds glob routes", async () => {
    const router = RouterBuilder.build<TestContext>((r) => {
      r.get("assets/*path", (ctx, route) => {
        ctx.values.push(route.fetch_param("path"))

        return Promise.resolve(HttpResult.ok())
      })
    })

    const ctx = context(RequestMethod.GET, "/assets/js/app.js")
    const result = await router.route(ctx)

    assert.ok(result)
    assert.equal(ctx.values.join(","), "js/app.js")
  })
})
