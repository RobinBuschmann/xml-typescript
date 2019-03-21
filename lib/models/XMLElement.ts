import 'reflect-metadata';
import * as Promise from 'bluebird';
import { XMLChild } from './XMLChild';
import { XMLAttribute } from './XMLAttribute';
import * as js2xmlparser from 'js2xmlparser';
import { DEFAULT_ATTRIBUTE_PROPERTY } from '../utils';
import { IXMLElementOptions } from '../interfaces/IXMLElementOptions';
import { ISchemaOptions } from '../interfaces/ISchemaOptions';
import { XMLText } from './XMLText';

const PARSER_OPTIONS = {
  declaration: {
    encoding: 'UTF-8'
  }
};
const META_KEY = 'xml:element';

export class XMLElement {
  private attributes: XMLAttribute[];
  private children: XMLChild[];
  private text: XMLText;
  private root?: string;

  static serialize(entity: any): string;
  static serialize(root: string, entity: any): string;
  static serialize(...args: any[]): string {
    const { root, entity } = this.getRootAndEntity(args);
    const schema = this.getSchema(entity);

    return js2xmlparser.parse(root, schema, PARSER_OPTIONS);
  }

  static serializeAsync(entity: any): Promise<string>;
  static serializeAsync(root: string, entity: any): Promise<string>;
  static serializeAsync(...args: any[]): Promise<string> {
    const { root, entity } = this.getRootAndEntity(args);

    return this.getSchemaAsync(entity).then(schema => js2xmlparser.parse(root, schema, PARSER_OPTIONS));
  }

  static getSchema(entities: any[], schemaOptions?: ISchemaOptions): any;
  static getSchema(entity: any, schemaOptions?: ISchemaOptions): any;
  static getSchema(arg: any, schemaOptions: ISchemaOptions = {}): any {
    if (arg === void 0) return;

    if (Array.isArray(arg)) {
      return arg.map(entity => this.processSchema(entity, false, schemaOptions));
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
      return Promise.all(arg.map(entity => processAsync(entity)));
    }
    return processAsync(arg);
  }

  static getXMLElement(target: any): XMLElement | undefined {
    return Reflect.getMetadata(META_KEY, target);
  }

  static setXMLElement(target: any, element: XMLElement): void {
    return Reflect.defineMetadata(META_KEY, element, target);
  }

  static getOrCreateIfNotExists(target: any): XMLElement {
    let element = this.getXMLElement(target);

    if (!element) {
      element = new XMLElement();
      this.setXMLElement(target, element);
    }

    return element;
  }

  static annotate(target: any, options: IXMLElementOptions): void {
    const element = this.getOrCreateIfNotExists(target);

    element.root = options.root;
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

  addAttribute(attribute: XMLAttribute): void {
    if (!this.attributes) this.attributes = [];

    this.attributes.push(attribute);
  }

  addChild(child: XMLChild): void {
    if (!this.children) this.children = [];

    this.children.push(child);
  }

  addText(text: XMLText): void {
    this.text = text;
  }

  private getSchema(entity: any, isAsync: boolean, schemaOptions: ISchemaOptions): void {
    const object: any = {};
    const attrProperty = schemaOptions.attrContainerName || DEFAULT_ATTRIBUTE_PROPERTY;

    if (this.text) {
      this.text.setSchema(object, entity);
    }

    if (this.attributes) {
      object[attrProperty] = {};
      this.attributes.forEach(attr => attr.setSchema(object[attrProperty], entity));
    }

    if (this.children) {
      this.children.forEach(child => child.setSchema(object, entity, isAsync, schemaOptions));
    }

    return object;
  }
}
