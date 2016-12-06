"use strict";
require('reflect-metadata');
var XMLAttribute_1 = require("../models/XMLAttribute");
function XMLAttribute() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    if (args.length === 1) {
        return function (target, key, descriptor) {
            return XMLAttribute_1.XMLAttribute.process(target, key, args[0], descriptor);
        };
    }
    return XMLAttribute_1.XMLAttribute.process(args[0], args[1], void 0, args[2]);
}
exports.XMLAttribute = XMLAttribute;
//# sourceMappingURL=XMLAttribute.js.map