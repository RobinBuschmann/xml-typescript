import 'es6-shim';
import {expect} from 'chai';
import {Person, PERSON_NS} from "../models/Person";
import {Hobby, HOBBY_NS} from "../models/Hobby";
import {XMLElement} from "../../models/XMLElement";
import {ns, ATTRIBUTE_PROPERTY} from "../../utils";

const elisa = new Person('Elisa', 'Perfect', 25);
const robin = new Person('Robin', 'Buschmann', 29);
const hobbies = [
  new Hobby('reading', 'loves to read books, magazines and web articles'),
  new Hobby('listening to Music', 'loves to listen to alternative and post-hardcore music'),
  new Hobby('travelling', 'loves to travel around the world'),
];
elisa.addFriend(robin);
elisa.addHobbies(hobbies);
elisa.addPets(['dog', 'cat']);

describe("Person", () => {

  describe("schema", () => {

    const schema = XMLElement.getSchema(elisa);

    describe("attributes", () => {

      it(`should have attributes "firstname" and "age" with specified values`, () => {

        const attributes = schema[ATTRIBUTE_PROPERTY];

        expect(attributes[ns(PERSON_NS, 'firstname')]).to.equal(elisa.getFirstname());
        expect(attributes[ns(PERSON_NS, 'fullname')]).to.equal(elisa.fullname);
        expect(attributes[ns(PERSON_NS, 'age')]).to.equal(elisa.getAge());
      });

    });

    describe("childs", () => {

      it(`should have child hobbies named as "hobby"`, () => {

        expect(schema[ns(PERSON_NS, 'hobby')]).not.to.be.undefined;
        expect(schema[ns(PERSON_NS, 'hobby')].length).to.equal(hobbies.length);
      });

      it(`should have child hobbies with attributes "name" and "description" with specified values`, () => {

        const hobbySchemas: any[] = schema[ns(PERSON_NS, 'hobby')];

        hobbySchemas.forEach(hobbySchema => {

          const hobbyAttrSchema = hobbySchema[ATTRIBUTE_PROPERTY];

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

    });

    describe("async process", () => {

      it(`should result in the same schema value as schema from sync process`, () =>
        XMLElement
          .getSchemaAsync(elisa)
          .then(asyncSchema => expect(asyncSchema).to.deep.equal(schema))
      );

    });

  });

  describe("xml", () => {

    const xml = XMLElement.serialize(elisa);

    it(`should be defined and of type string`, () => {

      expect(xml).not.to.be.undefined;
      expect(typeof xml).to.equal('string');
    });

  });

});

