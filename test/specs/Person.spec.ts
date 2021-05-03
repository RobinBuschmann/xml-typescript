import 'es6-shim';
import {expect} from 'chai';
import {Person, PERSON_NS} from "../models/Person";
import {Hobby, HOBBY_NS} from "../models/Hobby";
import {xml, xmlAttribute, xmlChild} from "../../index";
import {ns, DEFAULT_ATTRIBUTE_PROPERTY} from "../../lib/utils";

const elisa = new Person('Elisa', '_', 25);
const robin = new Person('Robin', 'Buschmann', 29);
const hobbies = [
  new Hobby('reading', 'loves to read books, magazines and web articles'),
  new Hobby('listening to Music', 'loves to listen to rock music'),
  new Hobby('travelling', 'loves to travel around the world'),
];
elisa.addFriend(robin);
elisa.addHobbies(hobbies);
elisa.addPets(['dog', 'cat']);

const personXmlElement = xml.getXMLElement(elisa);
const PS_NS_URL = 'http://person.example.com';

if (personXmlElement) {

  personXmlElement.addAttribute(xmlAttribute.createAttribute({
    name: 'ps',
    namespace: 'xmlns',
    value: PS_NS_URL,
    restrictTo: [elisa]
  }));

  personXmlElement.addChild(xmlChild.createXmlChild({
    name: 'thoughtful',
    namespace: PERSON_NS,
    value: true,
    restrictTo: [elisa]
  }));
}

describe("Person", () => {

  describe("schema", () => {

    const schema = xml.getSchema(elisa);

    describe("attributes", () => {

      it(`should have attributes "firstname" and "age" with specified values`, () => {

        const attributes = schema[DEFAULT_ATTRIBUTE_PROPERTY];

        expect(attributes[ns(PERSON_NS, 'firstname')]).to.equal(elisa.getFirstname());
        expect(attributes[ns(PERSON_NS, 'fullname')]).to.equal(elisa.fullname);
        expect(attributes[ns(PERSON_NS, 'age')]).to.equal(elisa.getAge());
        expect(attributes[ns('xmlns', PERSON_NS)]).to.equal(PS_NS_URL);
      });

    });

    describe("childs", () => {

      it(`should have dynamic child "thoughtful"`, () => {

        expect(schema).to.have.property(ns(PERSON_NS, 'thoughtful'), true);
      });

      it(`should have child hobbies named as "hobby"`, () => {
        expect(schema[ns(PERSON_NS, 'hobby')]).not.to.be.undefined;
        expect(schema[ns(PERSON_NS, 'hobby')].length).to.equal(hobbies.length);
      });

      it(`should have child hobbies with attributes "name" and "description" with specified values`, () => {

        const hobbySchemas: any[] = schema[ns(PERSON_NS, 'hobby')];

        hobbySchemas.forEach(hobbySchema => {

          const hobbyAttrSchema = hobbySchema[DEFAULT_ATTRIBUTE_PROPERTY];

          const hobby = hobbies.find(value =>
            value.getName() === hobbyAttrSchema[ns(HOBBY_NS, 'name')] &&
            value.getDescription() === hobbyAttrSchema[ns(HOBBY_NS, 'description')]
          );

          expect(hobby).not.to.be.undefined;
        });

      });

      it(`should have child friends named as "friend"`, () => {

        expect(schema[ns(PERSON_NS, 'friend')]).not.to.be.undefined;
        expect(schema[ns(PERSON_NS, 'friend')][0]).not.to.equal(robin);
      });


      it(`should have child pets processed with implicit structure`, () => {

        expect(schema.pets).not.to.be.undefined;
        expect(schema.pets.pet).not.to.be.undefined;
        expect(schema.pets.pet instanceof Array).to.be.true;
      });


      it(`should have friends with no "xmlns:${PERSON_NS}" attribute and no "thoughtful" child`, () => {

        const friend = schema[ns(PERSON_NS, 'friend')][0];
        const friendAttributes = friend[DEFAULT_ATTRIBUTE_PROPERTY];

        expect(friend).not.to.have.property(ns(PERSON_NS, 'thoughtful'));
        expect(friendAttributes).not.to.have.property(ns('xmlns', PERSON_NS));
      });

    });

    describe("async process", () => {

      it(`should result in the same schema value as schema from sync process`, () =>
        xml
          .getSchemaAsync(elisa)
          .then(asyncSchema => {
            expect(asyncSchema).to.deep.equal(schema)
          })
      );

    });

  });

  describe("schema with options", () => {

    const ATTR_PROPERTY = 'attributes';
    const OPTIONS = {attrContainerName: ATTR_PROPERTY};
    const schema = xml.getSchema(elisa, OPTIONS);

    describe("attributes", () => {

      it(`should have attributes "firstname" and "age" with specified values`, () => {

        const attributes = schema[ATTR_PROPERTY];

        expect(attributes[ns(PERSON_NS, 'firstname')]).to.equal(elisa.getFirstname());
        expect(attributes[ns(PERSON_NS, 'fullname')]).to.equal(elisa.fullname);
        expect(attributes[ns(PERSON_NS, 'age')]).to.equal(elisa.getAge());
        expect(attributes[ns('xmlns', PERSON_NS)]).to.equal(PS_NS_URL);
      });

    });

    describe("childs", () => {

      it(`should have dynamic child "thoughtful"`, () => {

        expect(schema).to.have.property(ns(PERSON_NS, 'thoughtful'), true);
      });

      it(`should have child hobbies named as "hobby"`, () => {

        expect(schema[ns(PERSON_NS, 'hobby')]).not.to.be.undefined;
        expect(schema[ns(PERSON_NS, 'hobby')].length).to.equal(hobbies.length);
      });

      it(`should have child hobbies with attributes "name" and "description" with specified values`, () => {

        const hobbySchemas: any[] = schema[ns(PERSON_NS, 'hobby')];

        hobbySchemas.forEach(hobbySchema => {

          const hobbyAttrSchema = hobbySchema[ATTR_PROPERTY];

          const hobby = hobbies.find(value =>
            value.getName() === hobbyAttrSchema[ns(HOBBY_NS, 'name')] &&
            value.getDescription() === hobbyAttrSchema[ns(HOBBY_NS, 'description')]
          );

          expect(hobby).not.to.be.undefined;
        });

      });

      it(`should have child friends named as "friend"`, () => {

        expect(schema[ns(PERSON_NS, 'friend')]).not.to.be.undefined;
        expect(schema[ns(PERSON_NS, 'friend')][0]).not.to.equal(robin);
      });


      it(`should have child pets processed with implicit structure`, () => {

        expect(schema.pets).not.to.be.undefined;
        expect(schema.pets.pet).not.to.be.undefined;
        expect(schema.pets.pet instanceof Array).to.be.true;
      });


      it(`should have friends with no "xmlns:${PERSON_NS}" attribute and no "thoughtful" child`, () => {

        const friend = schema[ns(PERSON_NS, 'friend')][0];
        const friendAttributes = friend[ATTR_PROPERTY];

        expect(friend).not.to.have.property(ns(PERSON_NS, 'thoughtful'));
        expect(friendAttributes).not.to.have.property(ns('xmlns', PERSON_NS));
      });

    });

    describe("async process", () => {

      it(`should result in the same schema value as schema from sync process`, () =>
        xml
          .getSchemaAsync(elisa, OPTIONS)
          .then(asyncSchema => expect(asyncSchema).to.deep.equal(schema))
      );

    });

  });

  describe("xml", () => {

    it(`should be defined and of type string`, () => {

      const result = xml.serialize(elisa);

      expect(result).not.to.be.undefined;
      expect(typeof result).to.equal('string');
    });

    describe("async process", () => {

      it(`should be defined and of type string`, () =>
        xml
          .serializeAsync('great-person', elisa)
          .then(result => {

            expect(result).not.to.be.undefined;
            expect(typeof result).to.equal('string');
          })
      );

    });

  });

});

