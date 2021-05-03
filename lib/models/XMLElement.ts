import 'reflect-metadata';
// import * as Promise from "bluebird";
import { XMLChild } from './XMLChild';
import { XMLAttribute } from './XMLAttribute';
import * as js2xmlparser from 'js2xmlparser';
import { DEFAULT_ATTRIBUTE_PROPERTY } from '../utils';
import { IXMLElementOptions } from '../interfaces/IXMLElementOptions';
import { ISchemaOptions } from '../interfaces/ISchemaOptions';
import merge from 'lodash.merge';

const PARSER_OPTIONS = {
  declaration: {
    encoding: 'UTF-8',
  },
  useCDATA: true,
  cdataKeys: ['*'],
  format: {
    doubleQuotes: true,
  },
};
export const META_KEY = 'xml:element';

export class XMLElement {
  private attributes: XMLAttribute[];
  private children: XMLChild[];
  private root?: string;

  static serialize(entity: any): string;
  static serialize(root: string, entity: any): string;
  static serialize(...args: any[]): string {
    const { root, entity } = this.getRootAndEntity(args);
    const schema = this.getSchema(entity);
    const parseOptions = Object.assign({}, PARSER_OPTIONS);
    return js2xmlparser.parse(root, schema, parseOptions);
  }

  static serializeAsync(entity: any): Promise<string>;
  static serializeAsync(root: string, entity: any): Promise<string>;
  static serializeAsync(...args: any[]): Promise<string> {
    const { root, entity } = this.getRootAndEntity(args);

    return this.getSchemaAsync(entity).then((schema) => js2xmlparser.parse(root, schema, PARSER_OPTIONS));
  }

  static getSchema(entities: any[], schemaOptions?: ISchemaOptions): any;
  static getSchema(entity: any, schemaOptions?: ISchemaOptions): any;
  static getSchema(arg: any, schemaOptions: ISchemaOptions = {}): any {
    if (arg === void 0) return;

    if (Array.isArray(arg)) {
      return arg.map((entity) => this.processSchema(entity, false, schemaOptions));
    }
    return this.processSchema(arg, false, schemaOptions);
  }

  static getSchemaAsync(entities: any[], schemaOptions?: ISchemaOptions): Promise<any>;
  static getSchemaAsync(entity: any, schemaOptions?: ISchemaOptions): Promise<any>;
  static getSchemaAsync(arg: any, schemaOptions: ISchemaOptions = {}): Promise<any> {
    const processAsync = (entity: any) => {
      return Promise.resolve(this.processSchema(entity, true, schemaOptions));
    };

    if (arg === void 0) Promise.resolve();

    if (Array.isArray(arg)) {
      return Promise.all(arg.map((entity) => processAsync(entity)));
    }
    return processAsync(arg);
  }

  static getXMLElement(target: any, root?: string): XMLElement | undefined {
    const rootName = root ? root : Reflect.getMetadata(META_KEY, target);
    return Reflect.getMetadata(rootName, target);
  }

  static setXMLElement(target: any, ele: XMLElement, root: string): void {
    Reflect.defineMetadata(META_KEY, root, target);
    let next = Object.getPrototypeOf(target);
    let tempEle = null;
    while (true) {
      tempEle = XMLElement.getXMLElement(next);
      if (typeof tempEle === 'undefined') {
        break;
      }
      const oldAttrs = ele.attributes?.map((e) => e.getName()) || [];
      const oldChilds = ele.children?.map((e) => e.getName()) || [];
     
      if (oldAttrs.length) {
        merge(ele, {
          attributes: tempEle.attributes?.filter((e) => oldAttrs.indexOf(e.name) === -1) || tempEle.attributes,
        });
      } else {
        Object.assign(ele, {
          attributes: tempEle.attributes && tempEle.attributes.length ? tempEle.attributes : [],
        });
      }

      if (oldChilds.length) {
        merge(ele, {
          children: tempEle.children?.filter((e) => oldChilds.indexOf(e.name) === -1) || tempEle.children,
        });
      } else {
        Object.assign(ele, {
          children: tempEle.children && tempEle.children.length ? tempEle.children : [],
        });
      }
      next = Object.getPrototypeOf(next);
    }
    return Reflect.defineMetadata(root, ele, target);
  }

  static getOrCreateIfNotExists(target: any, root?: string): XMLElement {
    const rootName = root ? root : Reflect.getMetadata(META_KEY, target);
    let element = this.getXMLElement(target, rootName);

    if (!element) {
      element = new XMLElement();
      element.root = rootName;
      this.setXMLElement(target, element, rootName);
    }

    return element;
  }

  static annotate(target: any, options: IXMLElementOptions): void {
    this.getOrCreateIfNotExists(target, options.root);
  }

  private static processSchema(entity: any, isAsync: boolean, schemaOptions: ISchemaOptions): any {
    if (entity && typeof entity === 'object') {
      const element = XMLElement.getXMLElement(entity);
      if (element) {
        return element.getSchema(entity, isAsync, schemaOptions);
      }
      
    }
    return entity;
  }

  private static getRootAndEntity(args: any[]): { root: string; entity: any } {
    let entity;
    let root;

    if (args.length === 1) {
      entity = args[0];
    } else {
      root = args[0];
      entity = args[1];
    }

    const element = this.getXMLElement(entity);

    if (!root && element && element.root) {
      root = element.root;
    }
    if (!root) {
      throw new Error('No root defined for entity: ' + JSON.stringify(entity));
    }

    return { root, entity };
  }
  hasAttribute(name: string): boolean {
    if (!this.attributes) {
      return false;
    }
    return this.attributes.filter((e) => e.getName() === name).length >= 1;
  }
  addAttribute(attribute: XMLAttribute): void {
    if (!this.attributes) this.attributes = [];
    this.attributes.push(attribute);
  }

  addChild(child: XMLChild): void {
    if (!this.children) this.children = [];

    this.children.push(child);
  }

  private getSchema(entity: any, isAsync: boolean, schemaOptions: ISchemaOptions): void {
    const object: any = {};
    const attrProperty = schemaOptions.attrContainerName || DEFAULT_ATTRIBUTE_PROPERTY;

    if (this.attributes) {
      object[attrProperty] = {};
      this.attributes.forEach((attr) => attr.setSchema(object[attrProperty], entity));
    }
    if (this.children) {
      this.children.forEach((child) => child.setSchema(object, entity, isAsync, schemaOptions));
    }

    return object;
  }
}
