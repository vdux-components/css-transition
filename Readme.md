
# css-transition

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

CSSTransition component for adding classes to an element while it is transitioning

## Installation

    $ npm install vdux-css-transition

## Usage

Use this component to apply classes to your nodes when they are being added/removed from the DOM. It works like this:

```javascript
function render () {
  return (
    <CSSTransition name='fade' enterTimeout={500} leaveTimeout={500}>
      <Tooltip />
    </CSSTransition>
  )
}
```

The `fade_in` class will be applied to each of the childreh when they are entering, and the `fade_out` class will be applied when they are leaving.

## API - props

  * `name` - The class to add when the component is entering and remove when it is leaving.
  * `enterTimeout` - Defaults to 0. How long the enter animation takes in milliseconds.
  * `leaveTimeout` - Deafults to 0. How long the leave animation takes in milliseconds.

## License

MIT
