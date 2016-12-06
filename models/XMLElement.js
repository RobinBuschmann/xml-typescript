"use strict";
require('reflect-metadata');
var Promise = require("bluebird");
var js2xmlparser = require('js2xmlparser');
var utils_1 = require("../utils");
var XMLElement = (function () {
    function XMLElement() {
    }
    XMLElement.serialize = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var entity;
        var root;
        if (args.length === 1) {
            entity = args[0];
        }
        else {
            root = args[0];
            entity = args[1];
        }
        var element = this.getXMLElement(entity.constructor, false);
        if (element && element.root) {
            root = element.root;
        }
        if (!root) {
            throw new Error('No root defined for entity: ' + JSON.stringify(entity));
        }
        var schema = this.getSchema(entity);
        return js2xmlparser.parse(root, schema);
    };
    XMLElement.getSchema = function (arg) {
        var _this = this;
        if (arg === void 0)
            return;
        if (Array.isArray(arg)) {
            return arg.map(function (entity) { return _this.processSchema(entity, false); });
        }
        return this.processSchema(arg, false);
    };
    XMLElement.getSchemaAsync = function (arg) {
        var _this = this;
        var processAsync = function (entity) {
            return Promise.resolve(_this.processSchema(entity, true));
        };
        if (arg === void 0)
            Promise.resolve();
        if (Array.isArray(arg)) {
            return Promise.all(arg.map(function (entity) { return processAsync(entity); }));
        }
        return processAsync(arg);
    };
    XMLElement.getXMLElement = function (targetClass, createIfNotExist) {
        if (createIfNotExist === void 0) { createIfNotExist = true; }
        var REFLECT_KEY = 'xml:element';
        var element = Reflect.getMetadata(REFLECT_KEY, targetClass);
        if (!element && createIfNotExist) {
            element = new XMLElement();
            Reflect.defineMetadata(REFLECT_KEY, element, targetClass);
        }
        return element;
    };
    XMLElement.process = function (targetClass, options) {
        var element = this.getXMLElement(targetClass);
        element.root = options.root;
    };
    XMLElement.processSchema = function (entity, isAsync) {
        if (entity && entity.constructor) {
            var element = XMLElement.getXMLElement(entity.constructor, false);
            if (element) {
                return element.getSchema(entity, isAsync);
            }
        }
        return entity;
    };
    XMLElement.prototype.addAttribute = function (attribute) {
        if (!this.attributes)
            this.attributes = [];
        this.attributes.push(attribute);
    };
    XMLElement.prototype.addChild = function (child) {
        if (!this.children)
            this.children = [];
        this.children.push(child);
    };
    XMLElement.prototype.getSchema = function (entity, isAsync) {
        var object = {};
        if (this.attributes) {
            object['@'] = {};
            this.attributes.forEach(function (attr) { return attr.setSchema(object[utils_1.ATTRIBUTE_PROPERTY], entity); });
        }
        if (this.children) {
            this.children.forEach(function (child) { return child.setSchema(object, entity, isAsync); });
        }
        return object;
    };
    return XMLElement;
}());
exports.XMLElement = XMLElement;
//# sourceMappingURL=XMLElement.js.map