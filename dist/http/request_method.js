import { raise } from "pimpanzee";
export var RequestMethod;
(function (RequestMethod) {
    RequestMethod["GET"] = "GET";
    RequestMethod["HEAD"] = "HEAD";
    RequestMethod["POST"] = "POST";
    RequestMethod["PUT"] = "PUT";
    RequestMethod["PATCH"] = "PATCH";
    RequestMethod["DELETE"] = "DELETE";
})(RequestMethod || (RequestMethod = {}));
(function (RequestMethod) {
    function parse(s) {
        if (!Object.keys(RequestMethod).includes(s))
            raise(`RequestMethod: cannot parse: ${s}`);
        return s;
    }
    RequestMethod.parse = parse;
})(RequestMethod || (RequestMethod = {}));
