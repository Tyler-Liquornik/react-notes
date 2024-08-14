
<hr>
<h4>Why React?</h4>
React is **declarative** meaning that the code we right more explicitly reads to describe the goal/state of what we want our code to do rather than the steps needed to get there

React is **state-based** allowing us to render HTML dynamically using JS code mixed with HTML code together in a language extension to JavaScript called JSX
 - React handles updating the UI under the hood, we just define the conditions for when we want React to do so

React is based around creating **reusable components** which create more structure and reduce duplicate code

Modern react uses **hooks** to help with state management, side effects, and more in a way that moves away from classes, towards functions and FP
- Act as **imperative** (non-declarative) escape hatches for when we need more fine grained control over Reacts features

<hr>
<h4>Setting Up a React Project</h4>
Init new react app with **Vite**: `npm create vite@latest <relative directory path>
- Vite setup automatically handles things like transpiling JSX to JS, minification (shorten var names, removing whitespaces, etc.) and more.
- Ensure to run `npm install` at the root to install necessary React (and other) dependencies
- Then, `npm run dev` at the root to run locally on `http://localhost:5173`

Note that a similar tool exists, **Create React App** but the preferred solution in 2024 is Vite

<hr>
<h4>JavaScript Refresh for React</h4>
JS has different runtime environments which change the behaviour of the code
- For the browser, the main purpose JS was built for
- Server side runtimes like **Node** or **Deno**
- Mobile runtimes via embedded websites like **React Native** or **Capacitor**
	
`<script>` is how we add JS code to a website *without React*, typically inside `<head>`
- `<script>alert('Hello')</script>` inline is an option, but not preferred except sometimes for very short scripts
- `<script src = "relPath/app.js"></script>` is the preferred option
-  `<script defer>` is used to only execute the script after loading all other HTMl, so as to ensure that all HTML needed to be accessed by the script is accessible
- `<script type="module">` allows treating our JS files as modules, allowing ES6 `import` & `export` between 
- In a React app, you'll notice none or few `<script>` tags
	- `react-scripts` is the package responsible for generating and injecting React code through a script tag for us automatically through the build process
	- JSX is not otherwise runnable by itself in the browser
	  
**ES6 modules** with `import` and `export` help us keep our code modular
- `export let string = "whatever"`  for named exports
- `export default "whatever"` to export without a name (only one per file allowed)
- `import {string as s} from "relpath/filename"` for named imports
- `import anyName from "relpath/filename" `for default imports
- `import * as anyName from "relpath/filename"` for packaging all exports into one obj
	- `anyName.default` is reserved for the default export
- React automatically converts `filename => filename.js` for us, this is not vanilla JS  behaviour and the `.js` is required without react
-  The build process automatically merges scripts into one larger file in the correct order to work with older, CommonJS `moudle.exports`, removing the need for script attribute `type="module"` 
