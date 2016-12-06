import 'reflect-metadata';
import {XMLAttribute as XMLAttributeModel} from "../models/XMLAttribute";

export function XMLAttribute(target: any, key: string, descriptor?: TypedPropertyDescriptor<any>): void;
export function XMLAttribute(options: any): Function;
export function XMLAttribute(...args: any[]): void|Function {

  if (args.length === 1) {

    return (target: any, key: string, descriptor?: TypedPropertyDescriptor<any>) => {

      return XMLAttributeModel.process(target, key, args[0], descriptor);
    };
  }
  return XMLAttributeModel.process(args[0], args[1], void 0, args[2]);
}
