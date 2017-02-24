import 'es6-shim';
import {XMLElement} from "./XMLElement";
import * as _ from "lodash";
import {ns} from "../utils";
import {IXMLChildOptions} from "../interfaces/IXMLChildOptions";
import {IFullXMLChildOptions} from "../interfaces/IFullXMLChildOptions";
import {ICustomXMLChildOptions} from "../interfaces/ICustomXMLChildOptions";
import {createCustomGetter} from "../utils";
import {ISchemaOptions} from "../interfaces/ISchemaOptions";

type Tree = {name: string; attributes: {[name: string]: string}};

export class XMLChild {

  private name: string;

  static annotate(target: any,
                  key: string,
                  options: IXMLChildOptions = {},
                  descriptor?: TypedPropertyDescriptor<any>): void {

    const element = XMLElement.getOrCreateIfNotExists(target);
    const fullOptions = Object.assign({
      getter(entity: any): any {
        if (descriptor && descriptor.get) {
          return descriptor.get.call(entity);
        }

        return entity[key];
      }
    }, options);

    fullOptions.name = options.name || key;

    element.addChild(new XMLChild(fullOptions as IFullXMLChildOptions));
  }

  static createXmlChild(options: ICustomXMLChildOptions): XMLChild {
    const hasGetter = typeof options.getter === 'function';
    const hasValue = options.value !== void 0;

    if ((hasGetter && hasValue) || (!hasGetter && !hasValue)) {

      throw new Error(`Either a getter or a value has to be defined for attribute "${options.name}".`);
    }

    const fullOptions = Object.assign({
      getter: createCustomGetter(options),
    }, options);

    return new XMLChild(fullOptions);
  }

  setSchema(target: any, parentEntity: any, isAsync: boolean = false, schemaOptions: ISchemaOptions): any {

    const entity = this.options.getter.call(null, parentEntity);
    const process = (schema: any) => {

      if (schema !== void 0 && schema !== null) {

        const structure: string|undefined = this.options.implicitStructure;
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

      XMLElement.getSchemaAsync(entity, schemaOptions)
        .then(schema => process(schema));
    } else {

      process(XMLElement.getSchema(entity, schemaOptions));
    }
  }

  private constructor(private options: IFullXMLChildOptions) {

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

  private getImplicitNodeTree(treeString: string): Tree[] {
    const REGEX = new RegExp('([a-z\\w0-9-\\$\\:]+?)\\[(.*?)\\]|([a-z\\w0-9-\\$\\:]+)', 'gi');
    let match = REGEX.exec(treeString);
    const tree: Tree[] = [];

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
