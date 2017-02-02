import {IXMLAttributeOptions} from "./IXMLAttributeOptions";

export interface IFullXMLAttributeOptions extends IXMLAttributeOptions {

  name: string;
  getter: (entity: any) => any;
}
