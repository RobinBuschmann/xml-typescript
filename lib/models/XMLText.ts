import { XMLElement } from './XMLElement';
import { IXMLTextOptions } from '../interfaces/IXMLTextOptions';
import { IFullXMLTextOptions } from '../interfaces/IFullXMLTextOptions';
import { ICustomXMLTextOptions } from '../interfaces/ICustomXMLTextOptions';
import { createCustomGetter, DEFAULT_TEXT_PROPERTY } from '../utils';

export class XMLText {
  private name: string;

  static annotate(
    target: any,
    key: string,
    options: IXMLTextOptions = {},
    descriptor?: TypedPropertyDescriptor<any>
  ): void {
    const element = XMLElement.getOrCreateIfNotExists(target);
    const fullOptions = {
      getter(entity: any): any {
        if (descriptor && descriptor.get) {
          return descriptor.get.call(entity);
        }
        return entity[key];
      },
      ...options
    };

    this.prototype.name = key;
    fullOptions.name = key;

    element.addText(new XMLText(fullOptions as IFullXMLTextOptions));
  }

  static createText(options: ICustomXMLTextOptions): XMLText {
    const hasGetter = typeof options.getter === 'function';
    const hasValue = options.value !== void 0;

    if ((hasGetter && hasValue) || (!hasGetter && !hasValue)) {
      throw new Error(`Either a getter or a value has to be defined for text "${options.name}".`);
    }

    const fullOptions = {
      getter: createCustomGetter(options),
      ...options
    };

    return new XMLText(fullOptions);
  }

  setSchema(target: any, entity: any): void {
    const value = this.options.getter.call(null, entity);

    if (value !== void 0) {
      target[DEFAULT_TEXT_PROPERTY] = value;
    } else if (this.options.required) {
      throw new Error(`Text ${this.name} is required, but empty.`);
    }
  }

  private constructor(private options: IFullXMLTextOptions) {}
}
