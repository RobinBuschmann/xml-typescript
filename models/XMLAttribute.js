"use strict";
var XMLElement_1 = require("./XMLElement");
var XMLAttribute = (function () {
    function XMLAttribute(options) {
        this.options = options;
        this.name = options.name;
        if (options.namespace) {
            this.name = options.namespace + ':' + this.name;
        }
    }
    XMLAttribute.process = function (target, key, options, descriptor) {
        if (options === void 0) { options = {}; }
        var targetClass = target.constructor;
        var element = XMLElement_1.XMLElement.getXMLElement(targetClass);
        options.name = options.name || key;
        options.getter = function (entity) {
            if (descriptor) {
                return descriptor.get.call(entity);
            }
            return entity[key];
        };
        element.addAttribute(new XMLAttribute(options));
    };
    XMLAttribute.prototype.setSchema = function (target, entity) {
        var value = this.options.getter.call(null, entity);
        if (value !== void 0) {
            target[this.name] = value;
        }
        else if (this.options.mandatory) {
            throw new Error("Attribute " + this.name + " is mandatory, but empty.");
        }
    };
    return XMLAttribute;
}());
exports.XMLAttribute = XMLAttribute;
//# sourceMappingURL=XMLAttribute.js.map