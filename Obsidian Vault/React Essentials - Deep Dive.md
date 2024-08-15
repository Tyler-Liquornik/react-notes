<hr>
<h4>Fragments</h4>
Sometimes he have a case in JSX where we have a "redundant" parent element

```App.jsx
export default function App() {
	return (
		<div>
			<p>text1</p>
			<p>text2</p>
			<p>text3</p>
		</div>
	);
}
```

Here, because `<div>` doesn't have any `id` or `className` or any properties to apply to all the children, it kind of doesn't really do anything, so we might be tempted to just try

```App.jsx
export default function App() {
	return (
		<p>text1</p>
		<p>text2</p>
		<p>text3</p>
	);
}
```

But we can't do this because we'll get an error when trying to return a JSX with multiple parent elements. We don't want the div because it could have an impact on things like layout/styling, and performance, since it's an extra element in the DOM.

The solution to this is to use a `<React.Fragment></React.Fragment>`, which will be transpiled away to give us a solution to our problem, there is no extra element in the DOM. To make this even cleaner, modern React recognize an empty tag `<></>` as a shorthand for `<React.Fragment></React.Fragment>`

A full example:

```App.jsx
function Summary({ text }) {
  return (
        <>
            <h1>Summary</h1>
            <p>{text}</p>
        </>
      );
}

function App() {
  return (
    <div id="app" data-testid="app">
      <Summary text="Fragments help you avoid unnecessary HTML elements." />
    </div>
  );
}

export default App;

```

<hr>
<h4>Forwarding Props</h4>

Consider a situation where make have a custom wrapper component `<Section>` from a basic one `<section>` to encapsulate our `title` in an `<h2>` from:

```App.jsx
export default function App() {
	reutrn (
		<section id="XXX" className="XXX">
			<h2>hello</h2>
			<p>world</p>
		</section>
	);
}
```

Which we want to split into:

```App.jsx
export default function Section({title, children, id, className}) {
	reutrn (
		<section id={id} className={className}>
			<h2>{title}</h2>
			{children}
		</section>
	);
}

export default function App() {
	reutrn (
		<Section title="hello" id="XXX" className="XXX">
			<p>world</p>
		</Section>
	);
}
```

The issue here is that passing `id` and `className` is already getting clunky, and if we had even more props to pass onto `Section`, it becomes messy and not very scalable. This is a common issue and so we have a common/conventional pattern to solve it.

The solution to this is using a pattern called **proxy props**. We can achieve this by using the rest operator `...` in our props destructing for a clean solution.

```App.jsx
export default function Section({title, children, ...props}) {
	reutrn (
		<section {...props}>
			<h2>{title}</h2>
			{children}
		</section>
	);
}

export default function App() {
	reutrn (
		<Section title="hello" id="XXX" className="XXX">
			<p>world</p>
		</Section>
	);
}
```

It should be clear here that `...props` *MUST NECESSARILY* be the last argument so that we can still have individual treatment of certain props before `...props` . A neat way to remember this is that `...props` is the *rest* operator because after the individually treated parameters, we are grouping together, the *remaining*, or *rest* of the parameters.

This pattern is particularly useful when dealing with wrapper, or **Higher Order Components (HOCs)** as we see here in his example. The hint here to use the proxy pattern is `Section` *wrapping* `section`. Note that HOCs exist in other forms that look a little different too, but the idea is here.

A full example:
```App.jsx
import Input from './Input';

function App() {
  return (
    <div id="content">
      <Input type="text" placeholder="Your name" />
      <Input richText placeholder="Your message" />
    </div>
  );
}
export default App;
```

```Input.jsx
export default function Input({ richText, ...props }) {
  return richText ? <textarea {...props} /> : <input {...props} />;
}
```

<hr>
<h4>Slotting Components</h4>
Thus far, we've worked with the `children` prop as a "special" prop which is automatically passed through whatever JSX is inside the tags of a Component

```App.jsx
<Component> <span>text</span> </Component>
```

We could have actually use children though in a way that resembles typical props, by passing in `children` like an HTML attribute as with any other prop.

```App.jsx
<Component children={<span>text</span>}/> 
```

Notice how we were able to use JSX expressions directly in the prop - well why can't we do this with any other prop besides `children` - we actually can! Then we can access different `children` JSX components in any order, anywhere we want. Passing in components via props is calls the **slots** patterns.

Consider a `<Layout/>` which takes in 3 components for `left`, `top`, and `center` and we want different styles for each. Passing all 3 of those in as `children` may not always work

```App.jsx
function App() {
	return (
		<Layout>
			<SideBar/>
			<NavBar/>
			<Content/>
		</Layout>
	);
}

function Layout({children}) {
	return (
		<div className="layout">
			{children} // we can't style each child separately
		</div>
	);
}
```

The solution to the problem using slotting:

```App.jsx
function App() {
	return (
		<Layout left={<Sidebar/>} top={<NavBar/>} center={<Content/>} />
	);
}

function Layout({top, left, center}) {
	return ( 
		<div className="layout"> 
			<div className="top">{top}</div> 
			<div className="left">{left}</div> 
			<div className="center">{center}</div> 
		</div> 
	);
}
```

We could even have grouped these together into a single prop, it doesn't solve this particular issue of needing a `className` for each component but is an option which you can sort of think of as a second `children` prop. Just be careful and ensure to use a fragment `<>` as a JSX expression still always must have one single parent component.

```App.jsx
function App() {
	return (
		<Layout sections={<><Sidebar/><NavBar/><Content/></>}/>
	);
```


<hr>
<h4>Dynamic Component Types</h4>
Consider a situation where we have a component that acts as a list, but sometimes we want to use it with `<ul>` and sometimes with `<ol>`. Making two different components is repeating a lot of code:

```App.jsx
const items = ( <> <li>Item 1</li> <li>Item 2</li> <li>Item 3</li> </> );

// Somewhere else
<List listItems={items}/>
```

```ListUL.jsx
export default function List({listItems}) {
	return (
		<ul>
			{listItems}
		</ul>
	);
}
```

```ListOL.jsx
export default function List({listItems}) {
	return (
		<ol>
			{listItems}
		</ol>
	);
}
```

Instead, we can make our component more flexible by allowing `<List/>` to have a prop to specify which component (or HTML element in this case) we want to use

```List.jsx
export default function List({listItems, ListContainer}) {
	return (
		<ListContainer>
			{listItems}
		</ListContainer>
	);
}
```

```App.jsx
const items = ( <> <li>Item 1</li> <li>Item 2</li> <li>Item 3</li> </> );

// Flexibility in options
<List listItems={items} listContainer="ul"/>
<List listItems={items} listContainer="ol"/>
<List listItems={items} listContainer={Section}/>
```

There a few things to note about syntax here. Firstly, we cannot use `listContainer` as a component identifier for our wrapper component with a lowercase 'l'.

```List.jsx
// Wont work
export default function List({listItems, listContainer}) {
	return (
		<listContainer>
			{listItems}
		</listContainer>
	);
}
```

Here, the compiler would look for a built in HTML element `listContainer` indicated by the lowercase 'l'. We instead need to use `ListContainer` with a capital 'L' to tell the compiler this is not a literal for the built in HTML element `listContainer`, but a component which holds the value of a React component *OR* a built in HTML element.

Also for syntax, when passing an HTML element into the props, use a string like `"ul"`, and when using a custom component, use the value of the expression with `{Section}`. Then `const ListContainer` can take on either of those, or any other valid component/element. 

<hr>
<h4>Default Prop Values</h4>
Going back to `<List />`, when we think about the goals of React, we want to make our components as reusable and flexible as possible. What if we knew that we will almost always want to configure `ListContainer` with `<ul>`? Or `<Section>`? Then we can set a **default prop value** for `ListContainer` so that we don't need to specify the value of `ListContainer` to keep our code less verbose:

```List.jsx
export default function List({listItems, ListContainer = "ul"}) {
	return (
		<ListContainer>
			{listItems}
		</ListContainer>
	);
}

// Alt
import Section from "./Section.jsx"

export default function List({listItems, ListContainer = Section}) {
	return (
		<ListContainer>
			{listItems}
		</ListContainer>
	);
}
```

<hr>
<h4>Summary Example</h4>
An example to cover many of the concepts covered in this section to create a flexible, reusable `<Button/>` component:

```App.jsx
import Button from './Button';
import HomeIcon from './HomeIcon';
import PlusIcon from './PlusIcon';

// Showing different use cases of <Button/>
// PlusIcon and HomeIcon are svg icon components
function App() {
  return (
     <div id="app">
      <section>
        <h2>Filled Button (Default)</h2>
        <p>
          <Button>Default</Button>
        </p>
        <p>
          <Button mode="filled">Filled (Default)</Button>
        </p>
      </section>
      <section>
        <h2>Button with Outline</h2>
        <p>
          <Button mode="outline">Outline</Button>
        </p>
      </section>
      <section>
        <h2>Text-only Button</h2>
        <p>
          <Button mode="text">Text</Button>
        </p>
      </section>
      <section>
        <h2>Button with Icon</h2>
        <p>
          <Button Icon={HomeIcon}>Home</Button>
        </p>
        <p>
          <Button Icon={PlusIcon} mode="text">
            Add
          </Button>
        </p>
      </section>
      <section>
        <h2>Buttons Should Support Any Props</h2>
        <p>
          <Button mode="filled" disabled>
            Disabled
          </Button>
        </p>
        <p>
          <Button onClick={() => console.log('Clicked!')}>Click me</Button>
        </p>
      </section>
    </div>
  );
}

export default App;
```

```Button.jsx
// Styles from index.css are also at play, but omitted for brevity
export default function Button({mode="filled", Icon, children, ...props}) {
    
    let classes = `button ${mode}-button`;
    const iconClass = Icon ? " icon-button" : "";
    classes += iconClass;
     
    return (
      <button className={classes} {...props}>
           {Icon && (
               <span className="button-icon">
                   <Icon />
               </span>
           )}
           <span>{children}</span>
       </button>
    );
}
```




