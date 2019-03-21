import "reflect-metadata";
import { XMLText as XMLTextModel } from "../models/XMLText";
import { IXMLTextOptions } from "../interfaces/IXMLTextOptions";

export function XMLText(target: any, key: string, descriptor?: TypedPropertyDescriptor<any>): void;
export function XMLText(options: IXMLTextOptions): Function;
export function XMLText(...args: any[]): void | Function {
  if (args.length === 1) {
    return (target: any, key: string, descriptor?: TypedPropertyDescriptor<any>) => {
      return XMLTextModel.annotate(target, key, args[0], descriptor);
    };
  }
  return XMLTextModel.annotate(args[0], args[1], void 0, args[2]);
}
