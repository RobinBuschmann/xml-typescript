"use strict";
require('reflect-metadata');
var XMLElement_1 = require("../models/XMLElement");
function XMLElement(options) {
    return function (target) {
        return XMLElement_1.XMLElement.process(target, options);
    };
}
exports.XMLElement = XMLElement;
//# sourceMappingURL=XMLElement.js.map