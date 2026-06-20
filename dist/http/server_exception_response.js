import { ParsedStacktraceEntry, Result, Schema as S } from "pimpanzee";
export class ServerExceptionResponse {
    name;
    message;
    cause_message;
    stacktrace;
    static Schema = S.object({
        name: S.string(),
        message: S.string(),
        cause_message: S.nullable(S.string()),
        stacktrace: S.json_array()
    });
    static from_json(json) {
        const parsed = ServerExceptionResponse.Schema.try_parse(json);
        if (Result.is_failure(parsed))
            throw new Error(`Could not parse as ServerExceptionResponse: ${json}`);
        const exception = parsed.value;
        return new ServerExceptionResponse(exception.name, exception.message, exception.cause_message, exception.stacktrace.map(e => ParsedStacktraceEntry.from_json(e)));
    }
    static from_exception(e) {
        return new ServerExceptionResponse(e.constructor.name, e.message, e.cause instanceof Error ? e.cause.message : null, e.parsed_stacktrace());
    }
    constructor(name, message, cause_message, stacktrace) {
        this.name = name;
        this.message = message;
        this.cause_message = cause_message;
        this.stacktrace = stacktrace;
    }
    to_json() {
        return {
            name: this.name,
            message: this.message,
            cause_message: this.cause_message,
            stacktrace: this.stacktrace.map(e => ({ symbol: e.symbol, source: e.source, location: e.location }))
        };
    }
}
