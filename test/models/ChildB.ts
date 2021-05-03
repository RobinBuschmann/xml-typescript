import {XMLElement} from "../../src/annotations/XMLElement";
import {XMLAttribute} from "../../src/annotations/XMLAttribute";
import { Child } from "./Child";
class ChildBBridge extends Child{}
@XMLElement({root: "child_a"})
export class ChildB extends ChildBBridge{
    @XMLAttribute
    ChildB_props = 3
}