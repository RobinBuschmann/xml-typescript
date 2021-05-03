
import {expect} from 'chai';
import {XMLChild} from "../../lib/annotations/XMLChild";
import { xml } from '../../';
import {XMLElement} from "../../lib/annotations/XMLElement";
import { Child } from "../models/Child";
import { ChildA } from "../models/ChildA";
import { ChildB } from "../models/ChildB";

@XMLElement({root: "parent"})
class Parent extends Child{
    @XMLChild({virtual: true})
    childs: Child[] = [];
}


describe("virtual children", () => {

    it(`should have attributes "firstname" and "age" with specified values`, () => {
        const a = new Parent();
        a.childs.push(new ChildA());
        a.childs.push(new ChildB());
        const s = xml.serialize(a);
        expect(s).contains("<child_b")
        expect(s).contains("<child_a")
    })
})
