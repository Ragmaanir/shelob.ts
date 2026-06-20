import type { IncomingMessage, ServerResponse } from "node:http"
import { assert, suite, test } from "microtest"
import { BasicAuthCredentials } from "../../src/basic_auth_credentials.js"
import { BasicAuthHandler } from "../../src/handlers/basic_auth_handler.js"
import { Handler } from "../../src/handlers/handler.js"
import { HttpContext } from "../../src/http/context.js"
import { HttpRequest, HttpResponse } from "../../src/http/http.js"
import { HttpResult } from "../../src/http/result.js"
import { HttpStatuses } from "../../src/http/status.js"

function request(authorization?: string): HttpRequest {
  return new HttpRequest({
    method: "GET",
    headers: authorization ? { authorization } : {},
    socket: {}
  } as unknown as IncomingMessage)
}

function context(authorization?: string): HttpContext {
  return new HttpContext(request(authorization), new HttpResponse({} as unknown as ServerResponse))
}

function basic_auth(user: string, password: string): string {
  return `Basic ${Buffer.from(`${user}:${password}`, "utf8").toString("base64")}`
}

class OkHandler extends Handler {
  call(_context: HttpContext): Promise<HttpResult> {
    return Promise.resolve(HttpResult.ok())
  }
}

suite("BasicAuthCredentials", () => {
  test(".from_request parses valid credentials", () => {
    const credentials = BasicAuthCredentials.from_request(request(basic_auth("user", "password")))

    assert.ok(credentials)
    assert.equal(credentials.user, "user")
    assert.equal(credentials.password, "password")
  })

  test("#authenticated", () => {
    const credentials = new BasicAuthCredentials("user", "password")

    assert.ok(credentials.authenticated(request(basic_auth("user", "password"))))
    assert(!credentials.authenticated(request(basic_auth("user", "wrong"))))
    assert(!credentials.authenticated(request()))
  })
})

suite("BasicAuthHandler", () => {
  test("#call delegates when credentials match", async () => {
    const handler = new BasicAuthHandler(new BasicAuthCredentials("user", "password"), "private")
    handler.set_next(new OkHandler())

    const result = await handler.call(context(basic_auth("user", "password")))

    assert.equal(result.status, HttpStatuses.OK)
  })

  test("#call returns unauthorized when credentials do not match", async () => {
    const handler = new BasicAuthHandler(new BasicAuthCredentials("user", "password"), "private")
    handler.set_next(new OkHandler())

    const result = await handler.call(context(basic_auth("user", "wrong")))

    assert.equal(result.status, HttpStatuses.UNAUTHORIZED)
    assert.equal(result.content, "HTTP 401 Unauthorized")
    assert.equal(result.headers.get("WWW-Authenticate"), "Basic realm=\"private\"")
  })
})
