
Typescript refresh from a primarily Java dev. This guide will also include using Typescript with React. It is very basic on purpose, to give a *full* refresh from zero.

##### Typescript Basics

Recall that Javascript actually knows about types natively, it just *assumes* those types with dynamic typing. In comparison, Typescript's static typing via type annotations allows explicit and clear typing for enhanced readability, better editor autocompletions, and developer certainty in what the code actually does. 

ECMAScript's 8 core language types as defined by the spec:
- number
- string
- boolean
- undefined
- null
- bigint
- symbol (unique & immutable type)
- object (the only non-primitive)
	- function `function f() {}`
	- array exotic objects `[]`
	- ordinary objects `{}`

There are also boxed reference type primitive wrappers by capitalizing primitive types in type annotations (i.e. `Number` instead of `number`), just like in java we have `Integer` vs. `int`.

Typescript adds one more option for typing `any` which means that we can assign any type with no error/warning. Use with caution, because spamming `any` too much just defeats the entire purpose of Typescript.

**Type Annotations** are declared using the `:` delimiter. For example `a : number`, with the type coming after the `:`.

Consider a simple function

```js
function add(a, b) {
  return a + b;
}
```

It's not entirely clear if this function is adding `string` types, `number` types, or something else. This function `add` could happily take either, and its functionality adapt at runtime with either numerical addition or string concatenation.

In contrast, its more clear we meant numerical addition if we write

```ts
function add(a: number, b: number){
  return a + b;
}
```

The key tidbit to remember here is that the type syntax is backwards compared to Java. So instead of `int a`, we write `a : int`.

In addition to this, your IDE should also show errors* if you tried to write `const sum = add("2", "5")` because the static typing allows the environment to understand at compile time that this is wrong, whereas in JS it would never know even if the intent was never to use `add` with `string` types. This error right away shows you that something is wrong, decreasing the likelihood of mistakes. 

\*Now, as a side note, the **default** TypeScript settings in your `tsconfig.json` **do not** stop compilation. The compiler still spits out JavaScript even when it reports type errors (with warnings). If you want the build to fail hard add this to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "noEmitOnError": true
  }
}
```

Typescript can be installed for your project with `npm install typescript`, or with `npm install -g typecript` for a global install.

The **Typescript Compiler** can then be invoked to compile your Typescript into Javascript with `npx tsc` (`tsc` for Typescript Compiler). You need to compile Typescript into Javascript because Typescript **does not** run natively in the browser. Without a `tsconfig.json` telling `tsc` which files to compile, you can still using `tsc` by manually specifying the file the compile with `npx tsc <file-name.ts>`.

##### Typescript Core Features

***Defining Types***

Typescript's awesomeness comes from the ability to define our own types. Consider a type `person`:

```ts
let person: {
  name: string,
  age: number; // both commas AND semicolon delimiters are fine for types
}
```

This allows us to get static typing on instances of the `person` type. So the following would pass compilation with no issues:

```ts
let person = {
  name: "Max", // note the comma delimiter, not semicolon for an instance
  age: 32
}
```

While the following would not cleanly compile:

```ts
let person = {
  name: "Max",
  age: "32" // compilation error (should be a number, not string)
}
```

These can be combined into a single statement as well with the type, and assignment in one statement as below, or on separate lines as above. Get used to seeing this weird "double assignment" looking syntax, where the first assignment is for the type with `:` and the second for the value with `=`.

```ts
let person: {
  name: string;
  age: number;
} = {
  name: "Max",
  age: 32
}
```


We can also combine types within each other. Consider a type `people`, as a unique type representation of `person[]` which combines an object and an array type (which we know is also a kind of object).

```ts
let people: {
  name: string,
  age: number;
}[];
```

***Type Inference***

By default, typescript tries to infer as many types as it can. This is called **Type inference**.

If you were to write:

```ts
let x = 3;
x = "strawberry"
```

Then the second line would still throw a compile-time error with Typescript, because even though `x : number` is not explicitly defined, Typescript has inferred the static typing and will not allowed `x` to be a `string`. You would instead need to *explicitly* write out `x : any` to allow this kind of behaviour.

Using type inference is encouraged as good practice to avoid needing to redundantly write out types all the time when not needed. You just have to remember that you are NOT using vanilla JS, and MUST declare `any` to get that vanilla behaviour.

***Union Types***

Sometimes you need to have a variable that can take on multiple different types. This is something new that you **CANNOT** do natively/cleanly in Java. The next closest thing would probably be:

```java
interface A { /* … */ }
class B implements A { /* … */ }
class C implements A { /* … */ }

A a = runtimeUnkownBOrC(); 
if (a instanceof B) { … } 
else if (a instanceof C) { … }
```

However interface inheritance is much more complicated than the simple need of "my object can be either strictly `B` or `C`".

**Union Types** elegantly solve this problem, by using the pipe`|` delimiter between your types. 

Consider a user name for which it might just be one name, or it might be a first name and last name, but we wanted an array to cleanly separate each of the names while using the same type for both. Union types allow us to safely write using the same type:

```ts
let name1 : string | string[] = "John";
let name2 : string | string[] = ["John", "Smith"];
```


***Type Aliases***

Thus far, we defined types using lowercase syntax, like `person` inline, which are **anonymous types**. We can instead define **Type Aliases** which can be reused for different variables, which is much more useful. Instead of `let person : { ... } = { ... }`, we can define a `type Person` (generally PascalCase syntax for a Type Aliases) that we can reuse easily for any variable, not just `person`. Also note the use of a new unique keyword for type aliases added by TS not available in JS, `type`. 

```ts
type Person = { // Note the use = '=' for a Type alias vs. : for anonymous typing
  name: string;
  age: number;
}

// Cleaner syntax with type aliasing
let person : Person = {...}
let people : Person[] = [{...}, {...}, ...]

```

`type` is purely a TS feature keyword, is will be thrown away by `tsc` at compile time with **type erasure** (similar to Java Generics type erasure implementation).

***Functions & Types***

Consider the `add` function from earlier.

```ts
function add(a : number, b : number) {
 return a + b;
}
```

In this form, there is still a type inference being made, which is the return type of the function. We can also explicitly type the return value as well:

```ts
function add(a : number, b : number) : number {
  return a + b;
}
```

Just take careful note again of the 'reversed' type syntax compared to java, which looks a bit wonky at first with so many `:` colons all over the place.

Consider that you technically have the freedom to do something like:

```ts
function add(a : number, b : number) : number | string {
  return a + b;
}
```

And this is valid because two numbers always add to either a number or string, but the string part is redundant. Be careful not to write in those redundant types, as it ruins the clarity offered by static typing.

Note also that `void` is available as a special type only for return values for functions that don't return anything, and it works basically the exact same as Java.

***Generics***

You know these well already from Java, it's just mostly a matter of syntax, and knowing when to use generics instead of `any`. 

Consider this snippet, where I want to add an entry to the beginning of an array, and I want to the function to still be flexible with what type is in the array so I used `array : any[]` 

```ts
function insertAtBeginningPure(array : any[], value : any) {
  const newArray = [value, ...array];
  return newArray;
}

const demoArray = [1, 2, 3]

const updatedArray = insertAtBeginningPure(demoArray, -1) // [-1, 1, 2, 3]
```

When you write `insertAtBeginningPure(array: any[], value: any)`, you’re telling TypeScript “I don’t know what’s in this array.” As a result, the inferred type becomes `any[]` and you lose static checking, meaning you could accidentally mix strings into a number array and TS won’t catch it. We also dont want to write `array : number[]` because we want `insterAtBegginingPure` to stay flexible and be able to work for `string[]` too.

This problem can be solved without giving up type safety. If you switch to a generic signature, you shift “knowing the type” over to the caller (i.e. the function doesn't know at compile time, but the implementer/caller does. This is unlike `any`, or similarly in java the wildcard `?` where even the implementer/caller does not know the type until runtime)

For example:
```ts
function insertAtBeginningPure<T>(array: T[], value: T): T[] {
  return [value, ...array];
}

const demoArray = [1, 2, 3]; // inferred as number[]

const updatedArray = insertAtBeginningPure(demoArray, -1); // T = number is inferred by the caller at compile time since demoArray is type number[]
```

Note again the difference in syntax, where the generic parameter definition `<T>` comes *after* the function name, not before like in Java.

With `insertAtBeginningPure(demoArray, "hello")`, with our improved generic function you get a compile-time error because the call infers `T = number` which cannot compile with `-1` as the second parameter, whereas the `any` implementation would compile fine and ruin type safety.

##### Typescript and React

***Typing Components***

Lets build a todo app to demonstrate how TSX empowers the React dev.

```tsx
import Todos from './components/Todos';

function App() {
  return (
    <div>
     <Todos/>
    </div>
  );
}

export default App;
```

```tsx

export default function Todos(props : { items: string[], children : any }) {
  return (
    <ul>
      <li> Learn React </li>
      <li> Learn Typescript </li>
    </ul>
  );
}

```

We can quickly see that manually specifying the type of our props is cumbersome, especially with the `children` prop always being there as a product os React itself which sucks to write out every time. The @types/react package (installed by default in every TSX project) exports `React.FC`, a generic interface that describes the shape of a functional component and automatically adds a children prop. So now our components are typed too! By using `React.FC<T = {}>`, you no longer have to manually include children, it comes with `React.FC` out of the box. The `<T>` is representing the type of the props (so some form of object), and the syntax `<T = {}>` is giving a **default type** to T of an empty object with no props (but still children) to clean this up the syntax for a propertyless component. 

Lets go back to our `Todos` component, and use `React.FC` properly parameterized, to avoid the need to manually write out the `children` prop.

```tsx
import React from 'react';

const Todos: React.FC<{items: string[]}> = (props) => {
  return (
    <ul>
	  {props.items.map((entry, index) => (<li key = {index}>{entry}</li>))}
      {props.children} {/* Note: children is already typed by React.FC */}
    </ul>
  );
}

export default Todos // Recall: arrow function components MUST have a separate declaration and export.
```

As a reference for what this would look like without typing in JSX:

```jsx
import React from 'react';

// Plain JSX (no TypeScript). “items” and “children” come in via props.
// Although simpler looking, at scale and on teams this is important!
const Todos = (props) => {
  return (
    <ul>
      {props.items.map((entry, index) => (<li key = {index}>{entry}</li>))}
      {props.children}
    </ul>
  );
};

export default Todos;
```

***Typescript Data Modelling***

TypeScript interfaces, classes, and type aliases each shape data models in different ways. Like `type`, `interface` is a TS only keyword/feature that is NOT in JS.

Note that we are in  `todos.ts` and not `todos.tsx` because this file is for models, and not components, there is no JSX here. 

```ts
interface Todo {
  id: string;
  text: string;
}

// New and confusing: TS interfaces allows (and usually have) fields, whereas in Java you can only have abstract getters and then the implementer has to define the implementation of the field

export default Todo;
```

Alternatively, typescript also lets us use classes more flexibly, putting properties as class level fields for a clean data model instead of requiring them in the constructor, which also works well for data modelling. Use a class over an interface if you plan on instantiating your data model (the intuition for when to do this will come)

```ts
class Todo {
  id: string;
  text: string;

  // Recall from JS: We could include a constructor, but dont need to since we don't plan on instantiating. A default empty constructor is implicitly here from JS compilation.

}

export default Todo
```

For a quick reminder, this is how you'd have to do it in JS, without typing:

```js
class Todo {
 constructor (id, text) {
   this.id = id;
   this.text = text;
   }
}

export default Todo
```

You could also doe this as type aliasing using the `type`, but that is not the preferred way because:

- A type alias can describe an object shape, but you can’t implement it in a class or extend it later (again the intuition will come for when you want this).
- Interfaces let you merge or extend definitions and work with implements; type aliases don’t support that.
- You should really only use a type when you need more complicated no OOP features like unions; stick to interfaces for plain object models.