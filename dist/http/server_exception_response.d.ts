import { type JSONValue, ParsedStacktraceEntry } from "pimpanzee";
export declare class ServerExceptionResponse {
    readonly name: string;
    readonly message: string;
    readonly cause_message: string | null;
    readonly stacktrace: ParsedStacktraceEntry[];
    static readonly Schema: import("pimpanzee").ObjectConverter<{
        name: string;
        message: string;
        cause_message: string | null;
        stacktrace: JSONValue[];
    }, {
        name: import("pimpanzee").StringConverter;
        message: import("pimpanzee").StringConverter;
        cause_message: import("pimpanzee").UnionConverter<string | null>;
        stacktrace: import("pimpanzee").ArrayConverter<JSONValue, import("pimpanzee").IdentityConverter>;
    }>;
    static from_json(json: JSONValue): ServerExceptionResponse;
    static from_exception(e: Error): ServerExceptionResponse;
    constructor(name: string, message: string, cause_message: string | null, stacktrace: ParsedStacktraceEntry[]);
    to_json(): {
        name: string;
        message: string;
        cause_message: string | null;
        stacktrace: {
            symbol: string;
            source: string;
            location: {
                line: number;
                column: number;
            };
        }[];
    };
}
