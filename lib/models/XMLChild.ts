import 'es6-shim';
import {XMLElement} from "./XMLElement";
import * as _ from "lodash";
import {ns} from "../utils";

export class XMLChild {

  private name: string;

  static process(target: any,
                 key: string,
                 options: any = {},
                 descriptor?: TypedPropertyDescriptor<any>): void {

    const targetClass = target.constructor;
    const element = XMLElement.getXMLElement(targetClass);

    options.name = options.name || key;
    options.getter = entity => {

      if (descriptor) {
        return descriptor.get.call(entity);
      }

      return entity[key];
    };

    element.addChild(new XMLChild(options));
  }

  setSchema(target: any, parentEntity: any, isAsync: boolean = false): any {

    const entity = this.options.getter.call(null, parentEntity);
    const process = (schema: any) => {

      if (schema !== void 0 && schema !== null) {

        const structure: string = this.options.implicitStructure;
        if (structure) {

          // a schema can be an array or an object,
          // so we ensure that this is always an
          // array and don't have to distinguish
          [].concat(schema).forEach(_schema => this.resolveImplicitStructure(structure, target, _schema));
        } else {

          if (entity === schema && this.options.nestedNamespace) {
            let nsSchema = {};

            for (let key in schema) {
              if (schema.hasOwnProperty(key)) {
                nsSchema[ns(this.options.nestedNamespace, key)] = schema[key];
              }
            }

            schema = nsSchema;
          }

          target[this.name] = schema;
        }
      }
    };

    if (isAsync) {

      XMLElement.getSchemaAsync(entity)
        .then(schema => process(schema));
    } else {

      process(XMLElement.getSchema(entity));
    }
  }

  private constructor(private options: any) {

    this.name = options.name;

    if (options.stripPluralS) {
      this.name = this.name.replace(/s$/, '');
    }

    if (options.namespace) {
      this.name = ns(options.namespace, this.name);
    }
  }

  private resolveImplicitStructure(structure: string, target: any, schema: any): void {
    const PLACEHOLDER = '$';

    if (!new RegExp(`.\\.\\${PLACEHOLDER}`).test(structure) &&
      !new RegExp(`.\\.\\${PLACEHOLDER}\\..`).test(structure) &&
      !new RegExp(`\\${PLACEHOLDER}\\..`).test(structure)) {
      throw new Error(`Structure '${structure}' is invalid`);
    }

    let tree = this.getImplicitNodeTree(structure);
    const indexOfPlaceholder = tree.findIndex(node => node.name === PLACEHOLDER);
    tree[indexOfPlaceholder].name = this.name;

    for (let i = 0; i < tree.length; i++) {
      let node = tree[i];
      if (!Array.isArray(target)) {
        if (!target[node.name]) {
          if (i !== indexOfPlaceholder) {
            target[node.name] = {'@': node.attributes};
          } else {
            target[node.name] = [];
          }
        }
        target = target[node.name];
      } else {
        const newTarget = {};
        target.push(newTarget);
        target = newTarget;
      }
      if (i === tree.length - 1) {
        if (Array.isArray(target)) {
          target.push(schema);
        } else {
          target[node.name] = _.merge(schema, {'@': node.attributes});
        }
      }
    }
  }

  private getImplicitNodeTree(treeString: string): Array<{name: string; attributes: {[name: string]: string}}> {
    const REGEX = new RegExp('([a-z\\w0-9-\\$\\:]+?)\\[(.*?)\\]|([a-z\\w0-9-\\$\\:]+)', 'gi');
    let match = REGEX.exec(treeString);
    const tree = [];

    while (match !== null) {

      const tagName = match[1] || match[3];
      const attributeString = match[2];
      tree.push({
        name: tagName,
        attributes: this.getAttributes(attributeString)
      });
      match = REGEX.exec(treeString);
    }
    return tree;
  }

  private getAttributes(attributeString: string): {[attrName: string]: string} {

    let attributes = {};

    if (attributeString) {

      attributeString.split(',').forEach(val => {

        const attributesArr = val.split('=');
        attributes[attributesArr[0]] = attributesArr[1];
      });
    }

    return attributes;
  }
}
