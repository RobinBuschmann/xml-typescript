import {XMLElement} from "./XMLElement";

export class XMLAttribute {

  private name: string;

  static process(target: any,
                 key: string,
                 options: any = {},
                 descriptor?: TypedPropertyDescriptor<any>): void {

    const targetClass = target.constructor;
    const element = XMLElement.getXMLElement(targetClass);

    options.name = options.name || key;
    options.getter = entity => {

      if (descriptor) {
        return descriptor.get.call(entity);
      }

      return entity[key];
    };

    element.addAttribute(new XMLAttribute(options));
  }

  setSchema(target: any, entity: any): void {

    const value = this.options.getter.call(null, entity);

    if (value !== void 0) {
      target[this.name] = value;
    } else if (this.options.mandatory) {

      throw new Error(`Attribute ${this.name} is mandatory, but empty.`);
    }
  }

  private constructor(private options: any) {

    this.name = options.name;

    if (options.namespace) {

      this.name = options.namespace + ':' + this.name;
    }
  }
}
