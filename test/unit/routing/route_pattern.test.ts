import { assert, suite, test } from "microtest"
import { RoutePattern } from "../../../src/api/routing/route_pattern.js"

suite("RoutePattern", () => {
  test(".compile", () => {
    const pattern = RoutePattern.compile("/assets/:kind/*path")
    const match = pattern.match("/assets/js/app/main.js")

    assert.equal(pattern.keys.join(","), "kind,path")
    assert.equal(match?.at(1), "js")
    assert.equal(match?.at(2), "app/main.js")
    assert.equal(pattern.match("/other/js/app/main.js"), null)
  })
})
