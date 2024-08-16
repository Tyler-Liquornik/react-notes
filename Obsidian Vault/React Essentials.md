<hr>
<h4>Transpiling JSX</h4>
JSX is a syntactic extension of Vanilla JS used by React. It is a flavour of XML that acts as
syntactic sugar, allowing storing XML style elements in JS bindings. It primarily represents HTML like structures but is not entirely limited to this and is thus considered XML to be precise.

In order to be used, JSX needs to be **transpiled** back into vanilla JavaScript. The modern solution for transpiling is **Babel**, which essentially converts between:

`<componentName {...properties}> {children} </componentName>
`React.createElement(componentName, {properties}, [children])

We'll talk more about properties, but know that `{...properties}` spreads `properties` into key value pairs as attributes/properties of the `componentName` element just like HTML attributes.

Another commonly used Babel feature is to use it for transpiling to lower ECMAScript versions to resolve compatibility issues with language features in older browsers that don’t support the most recent ES version.

<hr>
<h4>Components</h4>
**Components** are reusable, configurable, modular UI building blocks which are the central feature of React. We compose components together in a hierarchical FP style manner.
- Component functions must return *renderable* content, which is typically JSX but can also be primitive types like number, string, boolean, null, arrays of any of those, to render. You *cannot* return an object.
-  Define the component: `export default function Component() {return <some JSX here>}` 
-  Use the component in other components: `App() {return <div><Component/></div>}` 

`index.jsx` acts as the main entry point of our React app, which might look something like:
```index.jsx
import React from 'react'; 
import ReactDOM from 'react-dom/client';  
import './index.css';  
import App from './App';  
  
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<App/>
	<React.StrictMode>
);
```
This is injected into `index.html` at `<div id="root">` as the root of the **Component Tree**
- React automatically analyzes and renders the component tree to update the DOM as needed

Note that wrapping our component tree in the `<React.StrictMode>` component is common practice and allows performing checks and warning logs when when in the development environment.

<hr>
<h4>Components Properties</h4>
**Props** are properties passed into a component to customize its functionality. They are in essence *custom attributes* if we consider our component as a custom HTML tag

```Component.js
<Component stringProp="value" numProp={99} objProp={{key: val}} arrayProp={['val1', 'val2', 'val3']} /> 
```
An important note here is that any non-string props need to be passed in with curly braces to evaluate the value of whatever is passed in

We would define these props in our component packaged into a single object conventionally named `props`, and then access individual props with `props.stringProp`, `props.numProp`, etc.
```Component.jsx
function Component(props) {
	return (
		<p>{props.stringProp} {props.numProp}</p>
	)
}
```

A lot of the time when we want to reuse a component and pass different props in, where the props are different data we want to conditionally render we might define all the data in a separate file, say `data.js` with an array of different data:

```data.js
export default [
 {
	 stringProp: "a"
	 numProp: 1
 },
 {
	 stringProp: "b"
	 numProp: 2
 },
 {
	 stringProp: "c"
	 numProp: 3
 }
]
```

```App.jsx
import DATA from ./data.js

export default App() {
	return (
		<>
			<Component
				{DATA[0]}
			/>
			<Component
				{DATA[1]}
			/>
			<Component
				{DATA[2]}
			/>
		</>
	)
}
```

Note that the spread operator here works because the prop names in `DATA` match the prop values accessed in Component. It's best to always ensure these match.

We can instead destructure props to avoid this issue as an alternate syntax

```Component.jsx
function Component({stringProp, numProp}) {
	return (
		<p>{stringProp} {numProp}</p>
	)
}
```

```App.jsx
import DATA from ./data.js

export default App() {
	return (
		<>
			<Component
				{...DATA[0]}
				// alt syntax:
				// stringProp={DATA[0].stringProp}
				// numProp={DATA[0].numProp}
			/>
			<Component
				{...DATA[1]}
			/>
			<Component
				{...DATA[2]}
			/>
		</>
	);
}
```

A full example:

```App.js
const DATA = [
    {
        title: "Learn React",
        description: "In-depth"
    },
    {
        title: "Practice",
        description: "Practice working with React components etc"
    }
]

export function CourseGoal({title, description}) {
  return (
    <li>
      <h2>{title}</h2>
      <p>{description}</p>
    </li>
  );
}

function App() {
  return (
    <div id="app" data-testid="app">
      <h1>Time to Practice</h1>
      <p>One course, many goals! 🎯</p>
      <ul>
        <CourseGoal {...DATA[0]}/>
        <CourseGoal {...DATA[1]}/>
      </ul>
    </div>
  );
}

export default App;
```

<hr>

<h4>Images as Properties</h4>
Another small detail is the way we pass in properties for the source of **images**. We typically prefer not to directly pass in paths to images in React like
`<img src="./relPath/img.png">` 
This is because these paths are not processed in bundling at build time which can lead to issues like broken paths or missing files in prod, and caching image file issues.

Instead, React enables us to load images through `import` statements. This is NOT a Vanilla JS feature, React will transpile these imports into Vanilla JS compatable code at build time.

```App.js
import img from './relPath/img.png';

<img src={img}>
```

In this way, you can think of the image itself being the property that React is loading from the import instead of its literal path in the element `<img>`

<hr>

<h4>Component Composition</h4>
Another use case for our props is that we want make use of some text or HTML/JSX elements inside our custom component like this:

```App.js
<Modal>
	<h2>Warning</h2>
	<p>Do you want to delete this file?</p>
</Modal>
```
Instead of doing something like this:
```
<Modal title="Warning" description="Do you want to delete this file?" />
```
In this case, React automatically sets a special field of props called **children** which allows accessing any content inside our custom component tag. We might use it something like:
```App.js
function Model(props) {
	return <div id="modal">{props.children}</div>
}
```
Or equivalently, with restructuring:
```App.js
function Model({children}) {
	return <div id="modal">{children}</div>
}

```

This concept is called **component composition**, and is just a different approach to passing information into our component. It is not inherently better or worse than using attributes to pass props, it's just context dependent which one makes more sense.

A full example:

```App.js
import Card from './Card';

function App() {
  return (
    <div id="app">
      <h1>Available Experts</h1>
      <Card name="Anthony Blake">
        <p>
          Blake is a professor of Computer Science at the University of
          Illinois.
        </p>
        <p>
          <a href="mailto:blake@example.com">Email Anthony</a>
        </p>
      </Card>

      <Card name="Maria Miles">
        <p>
          Maria is a professor of Computer Science at the University of
          Illinois.
        </p>
        <p>
          <a href="mailto:blake@example.com">Email Maria</a>
        </p>
      </Card>
    </div>
  );
}

export default App;

```

```Card.js
import "./index.css" // didn't include this in these notes

export default function Card({name, children}) {
    return (
            <div className="card">
                <h2>{name}</h2>
                <div>{children}</div>
            </div>
        );
}
```


<hr>
<h4>Registering Events</h4>
In Vanilla JS, if we want some functionality when we click a button, we would add an event listener to it, like

`document.querySelector("button").addEventListener("click", () => doSomething())`

But as we know we want to move away from this declarative style towards an imperative one with React. We instead doing something like this:

```TabButton.js
export default function TabButon({children}) {
	function handleClick(param) {
		doSomething(param);
	}

	return (
		<button onClick={() => handleClick(param)}>{children}</button>
	);
}
```

The convention here is functions triggered by events should be named `onEvent` should have a handler named `handleEvent` when needed. Carefully note that we chose *not to use an arrow function in the case handleClick is parameterless* wed need to pass `handleClick` itself and do not evaluate it with `handleClick()`

Now, we're going to want to use this event to trigger some sort of a change in our UI of course. Naively, we might think to try something like

```App.js
function App() {
  let tabContent = 'Please click a button';

  function handleSelect(selectedButton) {
    tabContent = selectedButton;
  }


  return (
    <div>
		<section id="examples">
		  <menu>
			<TabButton onClick={() => handleSelect('components')}>
			  Components
			</TabButton>
			<TabButton onClick={() => handleSelect('jsx')}>JSX</TabButton>
			<TabButton onClick={() => handleSelect('props')}>Props</TabButton>
			<TabButton onClick={() => handleSelect('state')}>State</TabButton>
		  </menu>
		  {tabContent}
		</section>
    </div>
  );
}
```
But the issue here is that upon changing `tabContent` with `function handleSelect`, React still only renders `App` once and thus nothing happens. We need a way to tell React "hey, even with the same props in `App` you need to rerender". And this is where managing the **state** of our UI comes into play.

<hr>

<h4>Introduction to Hooks with Statefulness</h4>
Statefulness in React is implemented through a special **hook** `useState` which React provides through

```App.js
import {useState} from 'react'
```

Hooks are simply functions which begin with `use` (by convention) which provide access to special React features, which we use *at the top of our component outside the JSX in the return statement*, and *NEVER nested inside of function*. We can use the `useState` hook to solve our problem above as such, and react will know to rerender on a state change:

```App.js
function App() {
  const [selectedTopic, setSelectedTopic] = useState('Please click a button');

  function handleSelect(selectedButton) {
    setSelectedTopic(selectedButton);
  }

  return (
    <div>
		<section id="examples">
		  <menu>
			<TabButton onClick={() => handleSelect('components')}>
			  Components
			</TabButton>
			<TabButton onClick={() => handleSelect('jsx')}>JSX</TabButton>
			<TabButton onClick={() => handleSelect('props')}>Props</TabButton>
			<TabButton onClick={() => handleSelect('state')}>State</TabButton>
		  </menu>
		  {selectedTopic}
		</section>
    </div>
  );
}
```

`useState` returns an array which two elements, which we conventionally name `[state, setState]`. Doing `useState(initialVal)` will set `state` to `initialVal` as a default before `setState` is called for the first time, and also is a hint for the type that `state` stores. The first element `state` stores the value of the state, in whatever type that may be, and the second element `setState` is a function to set the state and re-execute/rerender the component function. This is also why we safely (and conventionally) can use `const` for `[state, setState]`, since the whole `App` component in our example is rerendered when `setState` is called with the new value of `state` and thus we never write to the `state` variable.

One quirk to note here is if we were to try and log the new state after setting it:

```App.jsx
  const [selectedTopic, setSelectedTopic] = useState('Please click a button');
  
  function handleSelect(selectedButton) {
    setSelectedTopic(selectedButton);
    console.log(selectedTopic)
  }
```
If the user were to click `<TabButton onClick={() => handleSelect('jsx')}> JSX </TabButton>` and change the state of `selectedTopic`, we would see the console logs `Please click a button` and *NOT* `jsx` even though we are logging `selectedTopic` *AFTER* we already set it.

This is because React is finishing off the execution of `handleSelect` and *THEN* it executes the rerender of the App component.

Another simple example to apply a discount from $100 to $75 on click of a button:

```App.jsx
import { useState } from 'react'

export default function App() {
    
    const [price, setPrice] = useState(100);
    
    function handleClick(price) {
        setPrice(price);
    }
    
    return (
        <div>
            <p data-testid="price">${price}</p>
            <button onClick={() => handleClick(75)}>Apply Discount</button>
        </div>
    );
}
```


<hr>
<h4>Conditional Rendering</h4>
Consider now if we wanted to render, instead of `{selectedTopic}` alone some more details. We still want to use `selectedTopic` to pick or data to display, but now instead `selectedTopic` to index properties on a JSON object `EXAMPLES` with nested JSON data to display. This is helpful for us to structure different parts of our data with key-value pairs so that we can extract them easily with the key.


```data.jsx
export const EXAMPLES = {
  components: {
    title: 'Components',
    description:
      'Components are the building blocks of React applications. A component is a self-contained module (HTML + optional CSS + JS) that renders some output.',
    code: `
function Welcome() {
  return <h1>Hello, World!</h1>;
}`,
  },
  jsx: {
    title: 'JSX',
    description:
      'JSX is a syntax extension to JavaScript. It is similar to a template language, but it has full power of JavaScript (e.g., it may output dynamic content).',
    code: `
<div>
  <h1>Welcome {userName}</h1>
  <p>Time to learn React!</p>
</div>`,
  },
  props: {
    title: 'Props',
    description:
      'Components accept arbitrary inputs called props. They are like function arguments.',
    code: `
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}`,
  },
  state: {
    title: 'State',
    description:
      'State allows React components to change their output over time in response to user actions, network responses, and anything else.',
    code: `
function Counter() {
  const [isVisible, setIsVisible] = useState(false);

  function handleClick() {
    setIsVisible(true);
  }

  return (
    <div>
      <button onClick={handleClick}>Show Details</button>
      {isVisible && <p>Amazing details!</p>}
    </div>
  );
}`,
  },
};
```

So in `App()` we could conveniently access data from the state of `selectedTopic` through 
```App.jsx
<div id="tab-content">
	<h3>{EXAMPLES[selectedTopic].title}</h3>
	<p>{EXAMPLES[selectedTopic].description}</p>
	<pre>
	  <code>{EXAMPLES[selectedTopic].code}</code>
	</pre>
</div>
```

Say now we don't want to display anything in our default state, or we want some default that isnt in `EXAMPLES`. You might naturally try something like one of:

```
const [selectedTopic, setSelectedTopic] = useState("");
const [selectedTopic, setSelectedTopic] = useState(null);
const [selectedTopic, setSelectedTopic] = useState("default state");
```

But these aren't going to work as we'll get an error when we lookup the property with `EXAMPLES[selectedTopic]`

The solution here is to **conditionally render** the content such that we never touch `selectedTopic` unless we need to, noting that rendering `null` *IS* allowed and just renders nothing. A common trick is to use `&&` which will return `null` right away if the guard coniditon is not met, as a sort of shorthand for a ternary operator.

```App.jsx
{selectedTopic && (
  <div id="tab-content">
    <h3>{EXAMPLES[selectedTopic].title}</h3>
    <p>{EXAMPLES[selectedTopic].description}</p>
    <pre>
      <code>{EXAMPLES[selectedTopic].code}</code>
    </pre>
  </div>
)}

```
With a default displaying message using a ternary operator instead:
```App.jsx
{!selectedTopic ? <p>Please select a topic.</p> : (
	<div id="tab-content">
		<h3>{EXAMPLES[selectedTopic].title}</h3>
		<p>{EXAMPLES[selectedTopic].description}</p>
		<pre>
		  <code>{EXAMPLES[selectedTopic].code}</code>
		</pre>
	</div>
)}
```

Another alternative is to take advantage of the fact that we reload whenever we change `selectedTopic` and use a variable to hold the JSX guarded by an if statement. This can be thought of similar to like having a static block at the topic of a Java class.

```App.jsx
if (selectedContent) {
 tabContent = 
	<div id="tab-content">
		<h3>{EXAMPLES[selectedTopic].title}</h3>
		<p>{EXAMPLES[selectedTopic].description}</p>
		<pre>
		  <code>{EXAMPLES[selectedTopic].code}</code>
		</pre>
	</div>
}

Somewhere in the JSX: {tabContent}
```

A full example: 
```
import React from 'react';

export default function App() {
    
    const [alert, setAlert] = React.useState(false);
    
    function handleClick(showAlert) {
        // Only update state if it's actually different from the current state 
        // This is good practice in case there are expensive operations here
        if (alert !== showAlert) {
            setAlert(showAlert);
        }
    }
    
    return (
      <div>
        {alert && (
            <div id="alert">
              <h2>Are you sure?</h2>
              <p>These changes can't be reverted!</p>
              <button onClick={() => handleClick(false)}>Proceed</button>
            </div>
        )}
        <button onClick={() => handleClick(true)}>Delete</button>
      </div>    
    );
}
```
<hr>
<h4>Dynamic CSS classes</h4>
In JSX, we may want to add something like `<button class={colour}>click me</button>`
The issue is that since JSX allows Javascript *AND* JSX, `class` is a reserved keyword in Javascript. Instead, we use `className` to resolve this issue, writing`<button className={colour}>click me</button>`

We could use this to pass in a value to create some logic to select a CSS class, through the props of a component:

```TabButton.jsx
export default function TabButton(onClick, isSelected) {
	return (
		// ... more code here
		<button className={isSelected ? "active" : null}>X</button>
	);
}
```

```App.js
export default function App() {
  const [selectedTopic, setSelectedTopic] = useState('Please click a button');

  function handleSelect(selectedButton) {
    setSelectedTopic(selectedButton);
  }

  return (
    <div>
		<section id="examples">
		  <menu>
			<TabButton onClick={() => handleSelect('components')}>
			  Components
			</TabButton>
			<TabButton 
				onClick={() => handleSelect('jsx')}>JSX</TabButton>
				isSelected={selectedTopic === 'jsx'}
			<TabButton 
				onClick={() => handleSelect('props')}>Props</TabButton>
				isSelected={selectedTopic === 'props'}
			<TabButton 
				onClick={() => handleSelect('state')}>State</TabButton>
				isSelected={selectedTopic === 'state'}
		  </menu>
		  {selectedTopic}
		</section>
    </div>
  );
}
```

Another full example:
```App.jsx
import React from 'react';

export default function App() {
    
    const [isStyled, setStyled] = React.useState(false);
    
    function handleClick(b) {
        setStyled(b);
    }
    
    return (
        <div>
            <p className={isStyled ? "active" : null}>Style me!</p>
            <button onClick={() => handleClick(true)}>Toggle style</button>
        </div>
    );
}

```

<hr>
<h4>Rendering a Dynamically Sized List</h4>
JSX allows us to have arrays of elements/components:

```App.jsx
function App() {
	return (
		<div>
			{[<p>Hello</p>, <p>World</p>]}
		</div>
	)
}
```

If we have a larger dataset, or a dataset which is dynamic in size that we need to display, we can take advantage of this by creating an array of objects for our data than using a key-indexable object of objects.

```data.js
export const CORE_CONCEPTS = [
  {
    image: componentsImg,
    title: 'Components',
    description:
      'The core UI building block - compose the user interface by combining multiple components.',
  },
  {
    image: jsxImg,
    title: 'JSX',
    description:
      'Return (potentially dynamic) HTML(ish) code to define the actual markup that will be rendered.',
  },
  {
    image: propsImg,
    title: 'Props',
    description:
      'Make components configurable (and therefore reusable) by passing input data to them.',
  },
  {
    image: stateImg,
    title: 'State',
    description:
      'React-managed data which, when changed, causes the component to re-render & the UI to update.',
  },
];
```

```CoreConcept.jsx
export default function CoreConcept({ image, title, description }) {
  return (
    <li>
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
    </li>
  );
}
```

Now we just need a clever way to iterate over all this data and create some JSX for each entry. And this is where JavaScripts `.map` array function comes into play:

```App.jsx
<ul>
	{CORE_CONCEPTS.map((entry) => (
	  <CoreConcept key={entry.title} {...entry} />
	))}
</ul>
```


Carefully note that we need a unique `key` prop when rendering multiple `<li>` tags. This is an enforced rule and an error is thrown if  you don't do this (more advanced details on this later). This `key` prop is mandatory for *rendering lists*, which is always from some method `Array.prototype.someArrayMethod`, most commonly `.map`. Regardless of the fact that `CoreConcept` never specified a prop `key`, it is a special keyword prop that we cannot use as a regular prop, similar to `children`. For static lists, while technically fine, it is often still preferred to the `key` prop. Note that these reserved props like `key` and `children` are also allowed to be used on regular HTML tags with JSX transpiling too, like `<p key=0>` .

The `key` prop is often indexed with integers, which we can easily implement with the `.map` overload (imagine in our case entries had duplicate titles, then `entry.title` doesn't work)


```App.jsx
<ul>
	{CORE_CONCEPTS.map((entry, index) => (
	  <CoreConcept key={index} {...entry} />
	))}
</ul>
```

A full example:

```Todo.jsx
import React from 'react';

export default function Todo({text}) {
    return <li>{text}</li>;
}
```

```App.jsx
import React from 'react';
import Todo from './Todo'

export const DUMMY_TODOS = [
    'Learn React',
    'Practice React',
    'Profit!'
];

export default function App() {
  return (
        <ul>
            {DUMMY_TODOS.map((entry, index) => (
                <Todo key={index} text={entry}></Todo>    
            ))}
        </ul>
      );
}
```