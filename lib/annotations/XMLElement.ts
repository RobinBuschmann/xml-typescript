import 'reflect-metadata';
import {XMLElement as XMLElementModel} from "../models/XMLElement";

export function XMLElement(options: any): Function {

  return (target: any) => {

    return XMLElementModel.process(target, options);
  };
}
