import 'reflect-metadata';
import * as Promise from "bluebird";
import {XMLChild} from "./XMLChild";
import {XMLAttribute} from "./XMLAttribute";
import * as js2xmlparser from 'js2xmlparser';
import {ATTRIBUTE_PROPERTY} from "../utils";

export class XMLElement {

  private attributes: XMLAttribute[];
  private children: XMLChild[];
  private root?: string;

  static serialize(entity: any): string;
  static serialize(root: string, entity: any): string;
  static serialize(...args: any[]): string {

    const {root, entity} = this.getRootAndEntity(args);
    const schema = this.getSchema(entity);

    return js2xmlparser.parse(root, schema);
  }

  static serializeAsync(entity: any): Promise<string>;
  static serializeAsync(root: string, entity: any): Promise<string>;
  static serializeAsync(...args: any[]): Promise<string> {

    const {root, entity} = this.getRootAndEntity(args);

    return this.getSchemaAsync(entity)
      .then(schema => js2xmlparser.parse(root, schema))
      ;
  }

  static getSchema(entities: any[]): any;
  static getSchema(entity: any): any;
  static getSchema(arg: any): any {

    if (arg === void 0) return;

    if (Array.isArray(arg)) {

      return arg.map(entity => this.processSchema(entity, false));
    }
    return this.processSchema(arg, false);
  }

  static getSchemaAsync(entities: any[]): Promise<any>;
  static getSchemaAsync(entity: any): Promise<any>;
  static getSchemaAsync(arg: any): Promise<any> {

    const processAsync = (entity: any) => {

      return Promise.resolve(this.processSchema(entity, true));
    };

    if (arg === void 0) Promise.resolve();

    if (Array.isArray(arg)) {

      return Promise.all(arg.map(entity => processAsync(entity)));
    }
    return processAsync(arg);
  }

  static getXMLElement(target: any, createIfNotExist: boolean = true): XMLElement {
    const REFLECT_KEY = 'xml:element';
    let element = Reflect.getMetadata(REFLECT_KEY, target);

    if (!element && createIfNotExist) {

      element = new XMLElement();
      Reflect.defineMetadata(REFLECT_KEY, element, target);
    }

    return element;
  }

  static process(target: any, options: any): void {

    let element = this.getXMLElement(target);

    element.root = options.root;
  }

  private static processSchema(entity: any, isAsync: boolean): any {
    if (entity && typeof entity === 'object') {

      const element = XMLElement.getXMLElement(entity, false);
      if (element) {

        return element.getSchema(entity, isAsync);
      }
    }
    return entity;
  }

  private static getRootAndEntity(args: any[]): {root: string, entity: any} {

    let entity;
    let root;

    if (args.length === 1) {
      entity = args[0];
    } else {
      root = args[0];
      entity = args[1];
    }

    const element = this.getXMLElement(entity, false);

    if (!root && element && element.root) {
      root = element.root;
    }
    if (!root) {
      throw new Error('No root defined for entity: ' + JSON.stringify(entity));
    }

    return {root, entity};
  }

  addAttribute(attribute: XMLAttribute): void {

    if (!this.attributes) this.attributes = [];

    this.attributes.push(attribute);
  }

  addChild(child: XMLChild): void {

    if (!this.children) this.children = [];

    this.children.push(child);
  }

  private getSchema(entity: any, isAsync: boolean): void {

    const object: any = {};

    if (this.attributes) {
      object['@'] = {};
      this.attributes.forEach(attr => attr.setSchema(object[ATTRIBUTE_PROPERTY], entity));
    }

    if (this.children) {
      this.children.forEach(child => child.setSchema(object, entity, isAsync));
    }

    return object;
  }
}
