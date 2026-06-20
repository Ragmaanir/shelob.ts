import type { JSONValue } from "pimpanzee"

export abstract class JsonMapper<T> {
  abstract call(t: T | null): JSONValue
}
