import {XMLElement} from "../../lib/annotations/XMLElement";
import {XMLAttribute} from "../../lib/annotations/XMLAttribute";
import { Child } from "./Child";
class ChildBBridge extends Child{}
@XMLElement({root: "child_a"})
export class ChildB extends ChildBBridge{
    @XMLAttribute
    ChildB_props = 3
}