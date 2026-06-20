export declare class Mime {
    readonly value: string;
    readonly extensions: Array<string>;
    constructor(value: string, extensions: Array<string>);
    static from_extension(extension: string): Mime | null;
}
export declare const MIMES: {
    HTML: Mime;
    JS: Mime;
    JSON: Mime;
    CSS: Mime;
    PNG: Mime;
    JPG: Mime;
    SVG: Mime;
    ICO: Mime;
    OCTET: Mime;
};
