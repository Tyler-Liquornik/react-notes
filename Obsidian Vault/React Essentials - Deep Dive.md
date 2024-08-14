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

Consider a situation where create a this custom component `<Section>` from a basic one `<section>` to encapsulate our `title` in an `<h2>` (this example is simple but of course we'd probably only bother splitting into a new component as complexity grows)

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
export default function Section({title, id, className, children}) {
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
export default function Section({title, id, ...props}) {
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

changesssss

