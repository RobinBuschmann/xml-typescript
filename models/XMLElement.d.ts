/// <reference types="bluebird" />
import 'reflect-metadata';
import * as Promise from "bluebird";
import { XMLChild } from "./XMLChild";
import { XMLAttribute } from "./XMLAttribute";
export declare class XMLElement {
    private attributes;
    private children;
    private root?;
    static serialize(entity: any): string;
    static serialize(root: string, entity: any): string;
    static getSchema(entities: any[]): any;
    static getSchema(entity: any): any;
    static getSchemaAsync(entities: any[]): Promise<any>;
    static getSchemaAsync(entity: any): Promise<any>;
    static getXMLElement(targetClass: any, createIfNotExist?: boolean): XMLElement;
    static process(targetClass: any, options: any): void;
    private static processSchema(entity, isAsync);
    addAttribute(attribute: XMLAttribute): void;
    addChild(child: XMLChild): void;
    private getSchema(entity, isAsync);
}
