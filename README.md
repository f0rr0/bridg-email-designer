# bridg-email-designer

### Installation

```
git clone https://github.com/Bridg/bridg-email-designer
cd bridg-email-designer
npm install # yarn install (if using yarn)
npm start # dev mode
npm run build # production build
```

### File Structure
The organization is very minimal. All React components live in `./src/components`. The Designer can be broadly broken into the following component hierarchy:

```

+-- `Designer.jsx`
    +-- `Header.jsx`
    +-- `Toolbox.jsx`
    |   +-- `Layouts.jsx`
    |   +-- `Content.jsx`
    |       +-- `Text.jsx`
    |       +-- `Html.jsx`
    |       +-- `Image.jsx`
    |       +-- `Banner.jsx`
    +-- `Canvas.jsx`
        +-- `CanvasTarget.jsx`
            +-- `Row.jsx`
                +-- `Column.jsx`
                    +-- `ColumnTarget.jsx`
```
### Drag and Drop
All 'draggable' and 'droppable' components are decorated with `DragSource` and `DragTarget` components respectively. Some common methods for these live in `./lib/generic-drag-source.js` and `./generic-drop-target.js`.

### New Content Types
The designer uses a webpack context to import all content components automatically. To create a new content component, for instance `Social.jsx`, create the file under `./src/components` and add `SOCIAL` to `./lib/types.js`

### Exporting Markup
Each content component defines an `export` function that returns the markup as it should end up in the email based on it's current state. The parser lives in `./lib/parser.js`. We use `foundation-emails.css` to get 100% email friendly markup. The styles are inlined with `juice`.

### Canvas State
`Canvas.jsx` is the most 'stateful' component here. The state lives in an Immutable List of Immutable Maps. The maps have a unique id which helps in deleting and reordering the rows. See `./src/components/Canvas.jsx` and `./lib/parser.js`.

### Styling
There are no CSS files besides the ZURB framework for emails which is inlined with the exported markup. The designer uses inline styling in JSX and `styled-components` exclusively. Also for the presentational components `material-ui` has been used.

### Deploy to gh-pages
```
npm run deploy
```
The repo is deployed at https://bridg.github.io/bridg-email-designer.
