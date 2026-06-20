export class Handler {
    next = null;
    set_next(next) {
        this.next = next;
        return next;
    }
    call_next(context) {
        if (!this.next) {
            throw new Error(`${this.constructor.name}: no next handler`);
        }
        return this.next.call(context);
    }
    static chain(handlers, terminal) {
        let next = terminal;
        for (const handler of handlers.toReversed()) {
            handler.set_next(next);
            next = handler;
        }
        return next;
    }
}
