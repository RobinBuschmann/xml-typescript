
import {XMLElement} from "../../lib/annotations/XMLElement";
import {XMLAttribute} from "../../lib/annotations/XMLAttribute";
import { Child } from "./Child";
class ChildABridge extends Child{}
@XMLElement({root: "child_b"})
export class ChildA extends ChildABridge {
    @XMLAttribute
    ChildA_props = 2
}
