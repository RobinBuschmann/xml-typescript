"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var XMLChild_1 = require("../../annotations/XMLChild");
var XMLElement_1 = require("../../annotations/XMLElement");
var XMLAttribute_1 = require("../../annotations/XMLAttribute");
exports.PERSON_ROOT = 'person';
exports.PERSON_NS = 'ps';
var Person = (function () {
    function Person(firstname, lastname, age) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.age = age;
    }
    Object.defineProperty(Person.prototype, "fullname", {
        get: function () {
            return this.firstname + ' ' + this.lastname;
        },
        enumerable: true,
        configurable: true
    });
    Person.prototype.getFirstname = function () {
        return this.firstname;
    };
    Person.prototype.getAge = function () {
        return this.age;
    };
    Person.prototype.addHobby = function (hobby) {
        if (!this.hobbies)
            this.hobbies = [];
        this.hobbies.push(hobby);
    };
    Person.prototype.addHobbies = function (hobbies) {
        if (!this.hobbies)
            this.hobbies = [];
        (_a = this.hobbies).push.apply(_a, hobbies);
        var _a;
    };
    Person.prototype.addFriend = function (friend) {
        if (!this.friends)
            this.friends = [];
        this.friends.push(friend);
    };
    Person.prototype.addFriends = function (friends) {
        if (!this.friends)
            this.friends = [];
        (_a = this.friends).push.apply(_a, friends);
        var _a;
    };
    Person.prototype.addPets = function (pets) {
        if (!this.pets)
            this.pets = [];
        (_a = this.pets).push.apply(_a, pets);
        var _a;
    };
    __decorate([
        XMLAttribute_1.XMLAttribute({ namespace: exports.PERSON_NS }), 
        __metadata('design:type', String)
    ], Person.prototype, "firstname", void 0);
    __decorate([
        XMLAttribute_1.XMLAttribute({ namespace: exports.PERSON_NS }), 
        __metadata('design:type', String)
    ], Person.prototype, "fullname", null);
    __decorate([
        XMLAttribute_1.XMLAttribute({ namespace: exports.PERSON_NS }), 
        __metadata('design:type', Number)
    ], Person.prototype, "age", void 0);
    __decorate([
        XMLChild_1.XMLChild({
            namespace: exports.PERSON_NS,
            name: 'hobby'
        }), 
        __metadata('design:type', Array)
    ], Person.prototype, "hobbies", void 0);
    __decorate([
        XMLChild_1.XMLChild({
            namespace: exports.PERSON_NS,
            stripPluralS: true
        }), 
        __metadata('design:type', Array)
    ], Person.prototype, "friends", void 0);
    __decorate([
        XMLChild_1.XMLChild({
            name: 'pet',
            implicitStructure: 'pets.$'
        }), 
        __metadata('design:type', Array)
    ], Person.prototype, "pets", void 0);
    Person = __decorate([
        XMLElement_1.XMLElement({ root: exports.PERSON_ROOT }), 
        __metadata('design:paramtypes', [String, String, Number])
    ], Person);
    return Person;
}());
exports.Person = Person;
//# sourceMappingURL=Person.js.map