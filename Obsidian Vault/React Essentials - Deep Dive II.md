<hr>
<h4>Asset Storage</h4>
We often store images, or other files/assets in the `/public` folder. These files are automatically transferred to the root of the project at build time, so when we want to reference something `public/img.png`, we would actually instead just do `img.png` as this is what the directory is after building. We typically use this directory for any assets reference directly in `index.html` or `index.css`, but can technically use it anywhere in the project. A common use for public assets are favicons.

For assets used anywhere in `src` (which is the vast majority of the project) we store assets somewhere in `src/*`. By convention we typically make a folder `src/assets` to hold assets. These assets are altered in the build process, and go through optimization processes like compression, resizing, and change of the file name with a unique hash for cache busting (prevent the browser from serving an outdated, cached version of the file).

<hr>
<h4>Updating State Based on Old State</h4>
Say we have a button which we click to toggle a state `isEditing`

```App.jsx

export default function App() {
	const [isEditing, setEditing] = useState(false);  
  
	function handleEditClick() {  
	  setEditing(!isEditing);  
	}

	return (
		<button onClick={() => handleEditClick()}>  
		  {isEditing ? "Save" : "Edit"}  
		</button>
	);
}
```

Although `handleEditClick()` will work as expected to toggle the state of `isEditing`, it is strongly recommended to instead *use an arrow function when updating state based on previous state*:

```App.jsx
function handleEditClick() {  
	  setEditing(wasEditing => !wasEditing);  
	}
```

React will automatically get the previous state with a one parameter arrow function, regardless of the name of the variable. A good convention is to name the parameter `wasBoolean` or `prevState` for a boolean or non-boolean state respectively. You can think about this similarly to like how passing an arrow functions of two parameters to`.map` automatically gives you `(entry, index)` semantically regardless of the actual variable names. 

The reason for this recommendation has to do with the way React deals with state behind the scenes. In reality, React does not instantly update the state on calling `setState`, it's actually scheduled to happen asynchronously. React batches multiple state calls together behind the scenes, only actually executing the re-render after all event handlers have run and called their `setState` functions, to prevent multiple rerenders during a single event.


```App.jsx
function handleEditClick() {  
	  setEditing(!isEditing);
	  setEditing(!isEditing);    
	}
```

We would expect the button to not change state because it toggles twice, but in reality it's to fast to process and the second `setEditing` is still using `isEditing` from the original state before the whole function `handleEditClick`.

The arrow function `wasEditing => !wasEditing` does not have this pitfall by always using the previous state instead of relying on the current state. In general, if the next state depends on the current state, rethink of it as the current state which we are updating to from the previous state.

<hr>
<h4>User Input</h4>

If we have a field `<input type="text" value={name}>`, the user won't be able to type anything in because the input field will be stuck on the `value={name}`. Our goal here is pre-populate `<input/>` with `name`, but still allow edits so we can take user input. `<input/>` has a special prop `defaultValue` which achieves this behaviour: `<input type="text defaultValue={name}/>`

An issue presents with this method though when we actually want to get the `value` the user types in when the user presses the `<button/>` to save the value they entered. The correct approach is to manage the name through another piece of state, and just use `value={name}`, updating the state `name` when the user types in `<input/>`.

```App.jsx
import { useState } from "react";  
  
export default function Player({ initialName, symbol }) {  
  const [name, setName] = useState(initialName);
  
  function handleChange(e) {  
    setName(e.target.value);  
  }  
  
  return (   
	{isEditing ? (  
	  <input type="text" required value={name} onChange={handleChange} />  
	) : (  
	  <span className="player-name">{name}</span>  
	)}   
  );  
}
```

A couple of things to take note of here
- When passing in a prop which can dynamically change with state, whatever value for the prop we pass in must logically be the initial state, thus we conventionally name the prop `initialName` to be clear in our code.
- The event property to listen for keystrokes for an `<input/>` is `onChange`. Memorize common `onEvent` props like this. 
- The function for `onChange` takes in one parameter for the event `e`, where `e.target.value` holds whatever value the user has typed in. Also memorize this.
- We can either pass the binding `handleChange`, or the functional form `(e) => handleChange(e)`, both are equally valid.
- The use of `value` over `defaultValue` is fine because we are rerendering on every keystroke event so `value` will change on the rerender. `defaultValue` would still have worked, but `value` semantically makes more sense now.

Managing user input like this is an example of a **two way binding**, because we're getting a value out of the input, and feeding a value back into it on the rerender after updating the state.

A full example (note: the button isn't actually saving anything in this example):

```App.jsx
import React from 'react';
import Review from './Review.js'

function App() {
  const [feedback, setFeedback] = React.useState("");
  const [student, setStudent] = React.useState("");
    
  function handleFeedbackChange(e) {
      setFeedback(e.target.value);
  }
  
  function handleStudentChange(e) {
      setStudent(e.target.value);
  }  

  return (
    <>
      <section id="feedback">
        <h2>Please share some feedback</h2>
        <p>
          <label>Your Feedback</label>
          <textarea required value={feedback} onChange={handleFeedbackChange}/>
        </p>
        <p>
          <label>Your Name</label>
          <input type="text" required value={student} onChange {handleStudentChange}/>
        </p>
      </section>
      <section id="draft">
        <h2>Your feedback</h2>
            <Review feedback={feedback} student={student}/>
        <p>
          <button>Save</button>
        </p>
      </section>
    </>
  );
}
export default App;
```

```Review.jsx
export default function Review({ feedback, student }) {
  return (
    <figure>
      <blockquote>
        <p>{feedback}</p>
      </blockquote>
      <figcaption>{student}</figcaption>
    </figure>
  );
}
```

<hr>

<h4>Immutability in State Updates</h4>
Another caveat we need to be careful of is updating state with reference types. React assumes **immutability** in whatever variable state is being updated, and thus looks for a change in the reference to the variable rather than the variable itself. The idea is that immutability provides extra safety, and React cannot look for a change in the value the reference points to because it *could* be immutable.

Take an example where we want to update the state of an array. We might try something like:

```App.jsx
const [items, setItems] = useState([1, 2, 3]); 

function addItem() { 
	items.push(4); 
	setItems(items);
}
```

We have mutated our array *without* changing it's memory reference, and thus this is not correct because React may not detect the change properly. Instead, we need to define a new array so that the reference is updated, guaranteeing React to properly handle the state change:

```App.jsx
const [items, setItems] = useState([1, 2, 3]); 

function addItem() { 
	setItems([...items, 4]);
}
```

Another *INCORRECT* solution to avoid that you might have intuitively tried is:
```App.jsx
const [items, setItems] = useState([1, 2, 3]); 

function addItem() {
	const newItems = items;
	newItems.push(4);
	setItems(newItems);
}
```

This doesn't work because `newItems = items` still points `newItems` to the same memory reference as `items`, and thus mutating `newItems` mutates `items`. We need to actually create a new array in memory, and explicitly having `[x, y, z, ...]` achieves this, similar to the `new` keyword for an object.