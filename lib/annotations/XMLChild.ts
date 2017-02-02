import 'reflect-metadata';
import {XMLChild as XMLChildModel} from "../models/XMLChild";
import {IXMLChildOptions} from "../interfaces/IXMLChildOptions";

export function XMLChild(target: any, key: string, descriptor?: TypedPropertyDescriptor<any>): void;
export function XMLChild(options: IXMLChildOptions): Function;
export function XMLChild(...args: any[]): void|Function {

  if (args.length === 1) {

    return (target: any, key: string, descriptor?: TypedPropertyDescriptor<any>) => {

      return XMLChildModel.annotate(target, key, args[0], descriptor);
    };
  }
  return XMLChildModel.annotate(args[0], args[1], void 0, args[2]);
}
