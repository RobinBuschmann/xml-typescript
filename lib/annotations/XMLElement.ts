import 'reflect-metadata';
import {XMLElement as XMLElementModel} from "../models/XMLElement";
import {IXMLElementOptions} from "../interfaces/IXMLElementOptions";

export function XMLElement(options: IXMLElementOptions): Function {

  return (target: any) => {

    return XMLElementModel.annotate(target.prototype, options);
  };
}
