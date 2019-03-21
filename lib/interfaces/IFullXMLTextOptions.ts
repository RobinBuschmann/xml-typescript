import { IXMLTextOptions } from './IXMLTextOptions';

export interface IFullXMLTextOptions extends IXMLTextOptions {
  name: string;
  getter: (entity: any) => any;
}
