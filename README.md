[![Build Status](https://travis-ci.org/RobinBuschmann/xml-typescript.png?branch=master)](https://travis-ci.org/RobinBuschmann/xml-typescript)

[![Dependencies status](https://david-dm.org/RobinBuschmann/xml-typescript.svg)](https://david-dm.org/RobinBuschmann/xml-typescript.svg)

# xml-decorators

Decorators for xml serialization. Uses [js2xmlparser](https://www.npmjs.com/package/js2xmlparser)
under the hood.

## Usage of decorators

```typescript
import {XMLElement, XMLAttribute, XMLChild, xml} from 'xml-decorators';

const HOBBY_NS = 'h';

class Hobby {

  @XMLAttribute({namespace: HOBBY_NS})
  private name: string;

  @XMLAttribute({namespace: HOBBY_NS})
  private description: string;
}

const PERSON_ROOT = 'person';
const PERSON_NS = 'ps';

@XMLElement({root: PERSON_ROOT}) // optional
class Person {

  @XMLAttribute({namespace: PERSON_NS})
  private firstname: string;

  private lastname: string;

  @XMLAttribute({namespace: PERSON_NS})
  get fullname(): string {

    return this.firstname + ' ' + this.lastname;
  }

  @XMLAttribute({namespace: PERSON_NS})
  private age: number;

  @XMLChild({
    namespace: PERSON_NS,
    name: 'hobby'
  })
  private hobbies: Hobby[];

  @XMLChild({
    namespace: PERSON_NS,
    stripPluralS: true
  })
  private friends: Person[];

  @XMLChild({
    name: 'pet',
    implicitStructure: 'pets.$'
  })
  private pets: string[];
  
 }
```

## Serialization
```typescript
const hobbies = [
  new Hobby('reading', 'loves to read books, magazines and web articles'),
  new Hobby('listening to Music', 'loves to listen to rock music'),
  new Hobby('travelling', 'loves to travel around the world'),
];
const pets = ['dog', 'cat'];
const bob = new Person('Bob', 'Mad', 29, hobbies, pets);

const bobXml = xml.serialize(bob);
```

Or if you want to override the root tag name or did not used the `@XMLElement` annotation.
```typescript
const bob2Xml = xml.serialize('great-person', bob);
```

### Result
```xml
<?xml version='1.0'?>
<great-person ps:firstname='Bob' ps:fullname='Bob Mad' ps:age='29'>
    <ps:hobby h:name='reading' h:description='loves to read books, magazines and web articles'/>
    <ps:hobby h:name='listening to Music' h:description='loves to listen to rock music'/>
    <ps:hobby h:name='travelling' h:description='loves to travel around the world'/>
    <pets>
        <pet>dog</pet>
        <pet>cat</pet>
    </pets>
</great-person>
```

### Async
```typescript
xml
  .serializeAsync(bob)
  .then(bobXml => console.log(bobXml))
  ;
```

## Schema
If you want to retrieve the "js2xmlparser" schema instead:
```typescript
xml.getSchema(bob);
xml.getSchemaAsync(bob) .then(/* */);
```

