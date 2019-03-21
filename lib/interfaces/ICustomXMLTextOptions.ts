import { IXMLTextOptions } from './IXMLTextOptions';

export interface ICustomXMLTextOptions extends IXMLTextOptions {
  name: string;
  getter?: (entity?: any) => any;
  value?: any;
  restrictTo?: any[];
}
