
import {expect} from 'chai';
import {XMLChild} from "../../lib/annotations/XMLChild";
import { xml } from '../../';
import {XMLElement} from "../../lib/annotations/XMLElement";
import { Child } from "../models/Child";
import { ChildA } from "../models/ChildA";
import { ChildB } from "../models/ChildB";

@XMLElement({root: "parent"})
class Parent {
    @XMLChild({virtual: true})
    childs: Child[] = [];
}


describe("virtual children", () => {

    it(`should have "child_a" and "child_b" elements`, () => {
        const a = new Parent();
        a.childs.push(new ChildA());
        a.childs.push(new ChildB());
        const s = xml.serialize(a);
        expect(s).contains("<child_a");
        expect(s).contains("<child_b");
    })
})
