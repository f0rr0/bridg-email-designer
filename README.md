# bridg-email-designer

[![Greenkeeper badge](https://badges.greenkeeper.io/f0rr0/bridg-email-designer.svg?token=c2bbba7ea5338cba75d84944c543983ad36969db5c45343fb2ffc4e4967ff7c4&ts=1533434825439)](https://greenkeeper.io/)

### Installation

```
npm install -g yarn
git clone https://github.com/Bridg/bridg-email-designer && cd bridg-email-designer
yarn install
yarn start # dev mode
yarn run build # production build
```

### File Structure
The organization is very minimal. All React components live in `./src/components`. The Designer can be broadly broken into the following component hierarchy:

```
Designer.jsx
  +--Header.jsx
  +--Toolbox.jsx
  |   +--Layouts.jsx
  |   +--Content.jsx
  |       +--Text.jsx
  |       +--Html.jsx
  |       +--Image.jsx
  |       +--Banner.jsx
  +--Canvas.jsx
      +--CanvasTarget.jsx
          +--Row.jsx
              +--Column.jsx
                  +--ColumnTarget.jsx
```
### Styling
There are no CSS files besides the ZURB framework for emails which is inlined with the exported markup. The designer uses inline styling in JSX and `styled-components` exclusively. Also for the presentational components `material-ui` has been used.

### Drag and Drop
All 'draggable' and 'droppable' components are decorated with `DragSource` and `DropTarget` components respectively. Some common methods for these live in `lib/generic-drag-source.js` and `lib/generic-drop-target.js`.

### New Content Types
The designer uses a webpack context to import all content components automatically. To create a new content component, for instance `Social.jsx`, create the file under `src/components` and add `SOCIAL` to `lib/types.js`

### Canvas State
`Canvas.jsx` is the most 'stateful' component here. The state lives in an Immutable List of Immutable Maps. The maps have a unique id which helps in deleting and reordering the rows. See `src/components/Canvas.jsx` and `lib/parser.js`.

### Exporting Markup
Each content component defines an `export` function that returns the markup as it should end up in the email based on it's current state. The parser lives in `lib/parser.js`. We use a modified version of [Foundation for Emails](http://foundation.zurb.com/emails.html) to get 100% email friendly markup. The styles are inlined with `juice`.

### Saving to `localStorage`
Every content component must always define a method called `serialize` which returns the bare minimum state which the component needs to reconstruct itself. This state is provided to the component as `state` on `props` and can be used in the constructor to populate relevant fields. See `lib/serialize.js` and `lib/deserialize.js` to see how this happens underneath.

### Undo/Redo
Each content type component is given a `pushToUndoStack` function on `props`. Calling this function saves the entire state of the designer in an immutable stack. Use this function sparingly and only when you need to. You don't want to pollute the undo stack with unwanted states.

### Customization via Tune tab
If your content component needs to be customized with controls in the Tune tab, you can call the `setCustom` function on `props` with a JSX element with all your controls as the only argument. Some controls which can be dropped in right away are:
* SwitchInput
* PlusMinus
* DialogInput
* ColorPicker

### Highlighted/Editing state
To provide relevant feedback when the component is being hovered or edited, we use React events: `onMouseEnter`, `onMouseLeave` and `onMouseDown` in conjunction with a HOC: `react-click-outside`. Use this with care as any such HOC will attach listeners to the `window` and might interfere with events elsewhere in the designer. The HOC should only be rendered when the component is being edited.

### Merge Tags
The merge tags available to the `Text` component live in `lib/mentions.js`. Edit that file to add new tags or modify the syntax as you please. However, make sure the syntax is consistent across all the tags.

### Presets/Themes
The designer includes some predefined presets that are ready to use. These live in `lib/presets.js`. Every preset contains a JSON representation of the entire designer state that is required to reconstruct it. Currently, to add more presets, design them in the designer as you'd like and save the design. Then, copy the contents of `canvas` in `localStorage` (can be accessed via [Chrome Developer Tools](https://developers.google.com/web/tools/chrome-devtools/manage-data/local-storage)) to the `presets` file. The key of the preset is converted to sentence case and used as the name for that preset.

### Deploy to gh-pages
```
npm run deploy
```
The repo is deployed at https://bridg.github.io/bridg-email-designer.
