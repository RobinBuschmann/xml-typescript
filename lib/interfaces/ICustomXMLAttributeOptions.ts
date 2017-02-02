import {IXMLAttributeOptions} from "./IXMLAttributeOptions";

export interface ICustomXMLAttributeOptions extends IXMLAttributeOptions {

  name: string;
  getter?: (entity?: any) => any;
  value?: any;
  restrictTo?: any[];
}
