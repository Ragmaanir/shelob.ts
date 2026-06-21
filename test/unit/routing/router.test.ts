import { assert, suite, test } from "microtest"
import { Router } from "../../../src/api/routing/router.js"
import { RequestMethod } from "../../../src/http/request_method.js"
import { HttpResult } from "../../../src/http/result.js"
import { HttpStatuses } from "../../../src/http/status.js"

suite("Router", () => {
  test("find_route", () => {
    const r = new Router()

    r.get("/tables/:id", (_ctx, _route) => Promise.resolve(HttpResult.status(HttpStatuses.OK)))

    const m = r.find_route(RequestMethod.GET, "/tables/1")

    assert.ok(m)
    assert.equal(m?.method, RequestMethod.GET)
    assert.equal(m?.fetch_param("id"), "1")
    assert.equal(m?.param("missing"), null)
  })
})
