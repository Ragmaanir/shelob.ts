import type { JSONValue } from "pimpanzee";
export declare abstract class JsonMapper<T> {
    abstract call(t: T | null): JSONValue;
}
