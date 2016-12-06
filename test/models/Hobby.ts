import {XMLAttribute} from "../../annotations/XMLAttribute";

export const HOBBY_NS = 'h';

export class Hobby {

  @XMLAttribute({namespace: HOBBY_NS})
  private name: string;

  @XMLAttribute({namespace: HOBBY_NS})
  private description: string;

  constructor(name: string,
              description: string) {

    this.name = name;
    this.description = description;
  }

  getName(): string {

    return this.name;
  }

  getDescription(): string {

    return this.description;
  }
}
