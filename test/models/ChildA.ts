
import {XMLElement} from "../../src/annotations/XMLElement";
import {XMLAttribute} from "../../src/annotations/XMLAttribute";
import { Child } from "./Child";
class ChildABridge extends Child{}
@XMLElement({root: "child_b"})
export class ChildA extends ChildABridge {
    @XMLAttribute
    ChildA_props = 2
}
