import { assert, suite, test } from "microtest"
import { Router } from "../../src/api/router.js"
import { RequestMethod } from "../../src/http/request_method.js"
import { HttpResult } from "../../src/http/result.js"
import { HttpStatuses } from "../../src/http/status.js"

suite("Router", () => {
  test("find_route", () => {
    const r = new Router()
    const called: string[] = []

    r.get("/tables/:id", (ctx, _params) => {
      called.push(ctx.request.url ?? "")

      return Promise.resolve(HttpResult.status(HttpStatuses.OK))
    })

    const m = r.find_route(RequestMethod.GET, "/tables/1")

    assert.ok(m)
    assert.equal(m.method, RequestMethod.GET)
  })
})
