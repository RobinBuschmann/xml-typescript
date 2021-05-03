
import {expect} from 'chai';
import {XMLChild} from "../../src/annotations/XMLChild";
import { xml } from '../../src';
import {XMLElement} from "../../src/annotations/XMLElement";
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

    it(`ChildA should have "Child_props" and "ChildA_props"`, () => {
        const a = new Parent();
        a.childs.push(new ChildA());
        const s = xml.serialize(a);
        expect(s).contains("Child_props='1'");
        expect(s).contains("ChildA_props='2'");
    })
})
