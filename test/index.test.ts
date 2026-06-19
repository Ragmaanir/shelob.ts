import { assert, suite, test } from "microtest"
import * as Shelob from "../src/index.js"

suite("index", () => {
  test("exports the barrel module", () => {
    assert.equal(Object.keys(Shelob), [])
  })
})
