import {IXMLChildOptions} from "./IXMLChildOptions";

export interface IFullXMLChildOptions extends IXMLChildOptions {

  name: string;
  getter: (entity: any) => any;
}
