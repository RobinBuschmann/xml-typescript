import {XMLElement} from "../../src/annotations/XMLElement";
import {XMLAttribute} from "../../src/annotations/XMLAttribute";

@XMLElement({root: "child"})
export class Child {
    @XMLAttribute
    Child_props = 1
}