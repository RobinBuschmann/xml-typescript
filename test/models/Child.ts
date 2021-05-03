import {XMLElement} from "../../lib/annotations/XMLElement";
import {XMLAttribute} from "../../lib/annotations/XMLAttribute";

@XMLElement({root: "child"})
export class Child {
    @XMLAttribute
    Child_props = 1
}