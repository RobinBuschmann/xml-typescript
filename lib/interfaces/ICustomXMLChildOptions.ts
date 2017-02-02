import {IXMLChildOptions} from "./IXMLChildOptions";

export interface ICustomXMLChildOptions extends IXMLChildOptions {

  name: string;
  getter?: (entity?: any) => any;
  value?: any;
  restrictTo?: any[];
}
