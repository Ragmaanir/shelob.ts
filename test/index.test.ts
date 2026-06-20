import { assert, suite, test } from "microtest"
import * as Shelob from "../src/index.js"

suite("index", () => {
  test("exports the barrel module", () => {
    assert.equal(typeof Shelob.Router, "function")
    assert.equal(typeof Shelob.Server, "function")
  })
})
