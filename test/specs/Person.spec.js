"use strict";
require('es6-shim');
var chai_1 = require('chai');
var Person_1 = require("../models/Person");
var Hobby_1 = require("../models/Hobby");
var XMLElement_1 = require("../../models/XMLElement");
var utils_1 = require("../../utils");
var elisa = new Person_1.Person('Elisa', 'Perfect', 25);
var robin = new Person_1.Person('Robin', 'Buschmann', 29);
var hobbies = [
    new Hobby_1.Hobby('reading', 'loves to read books, magazines and web articles'),
    new Hobby_1.Hobby('listening to Music', 'loves to listen to alternative and post-hardcore music'),
    new Hobby_1.Hobby('travelling', 'loves to travel around the world'),
];
elisa.addFriend(robin);
elisa.addHobbies(hobbies);
elisa.addPets(['dog', 'cat']);
describe("Person", function () {
    describe("schema", function () {
        var schema = XMLElement_1.XMLElement.getSchema(elisa);
        describe("attributes", function () {
            it("should have attributes \"firstname\" and \"age\" with specified values", function () {
                var attributes = schema[utils_1.ATTRIBUTE_PROPERTY];
                chai_1.expect(attributes[utils_1.ns(Person_1.PERSON_NS, 'firstname')]).to.equal(elisa.getFirstname());
                chai_1.expect(attributes[utils_1.ns(Person_1.PERSON_NS, 'fullname')]).to.equal(elisa.fullname);
                chai_1.expect(attributes[utils_1.ns(Person_1.PERSON_NS, 'age')]).to.equal(elisa.getAge());
            });
        });
        describe("childs", function () {
            it("should have child hobbies named as \"hobby\"", function () {
                chai_1.expect(schema[utils_1.ns(Person_1.PERSON_NS, 'hobby')]).not.to.be.undefined;
                chai_1.expect(schema[utils_1.ns(Person_1.PERSON_NS, 'hobby')].length).to.equal(hobbies.length);
            });
            it("should have child hobbies with attributes \"name\" and \"description\" with specified values", function () {
                var hobbySchemas = schema[utils_1.ns(Person_1.PERSON_NS, 'hobby')];
                hobbySchemas.forEach(function (hobbySchema) {
                    var hobbyAttrSchema = hobbySchema[utils_1.ATTRIBUTE_PROPERTY];
                    var hobby = hobbies.find(function (value) {
                        return value.getName() === hobbyAttrSchema[utils_1.ns(Hobby_1.HOBBY_NS, 'name')] &&
                            value.getDescription() === hobbyAttrSchema[utils_1.ns(Hobby_1.HOBBY_NS, 'description')];
                    });
                    chai_1.expect(hobby).not.to.be.undefined;
                });
            });
            it("should have child friends named as \"friend\"", function () {
                chai_1.expect(schema[utils_1.ns(Person_1.PERSON_NS, 'friend')]).not.to.be.undefined;
                chai_1.expect(schema[utils_1.ns(Person_1.PERSON_NS, 'friend')][0]).not.to.equal(robin);
            });
            it("should have child pets processed with implicit structure", function () {
                chai_1.expect(schema.pets).not.to.be.undefined;
                chai_1.expect(schema.pets.pet).not.to.be.undefined;
                chai_1.expect(schema.pets.pet instanceof Array).to.be.true;
            });
        });
        describe("async process", function () {
            it("should result in the same schema value as schema from sync process", function () {
                return XMLElement_1.XMLElement
                    .getSchemaAsync(elisa)
                    .then(function (asyncSchema) { return chai_1.expect(asyncSchema).to.deep.equal(schema); });
            });
        });
    });
    describe("xml", function () {
        var xml = XMLElement_1.XMLElement.serialize(elisa);
        it("should be defined and of type string", function () {
            chai_1.expect(xml).not.to.be.undefined;
            chai_1.expect(typeof xml).to.equal('string');
        });
    });
});
//# sourceMappingURL=Person.spec.js.map