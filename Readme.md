
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
    <CSSTransition timeout={500}>
      <Tooltip />
    </CSSTransition>
  )
}
```

Each child of `<CSSTransition/>` will have the following classes added to it:

  * `enter` - Immediately on creation
  * `enter-active` - On the next tick after the `enter` class is added
  * `leave` - When the component begins leaving
  * `leave-active` - On th enext tick after the `leave` class is added

## API - props

  * `timeout` - (Object|Number). If you specify a number, it'll be used as both the `enter` and `leave` timeout lengths in milliseconds. You may alternatively passn an object with `enter` and `leave` keys to specify them independently.

## Fade example (using [jss-simple](https://github.com/ashaffer/jss-simple) for css)

```javascript
import css from 'jss-simple'

function render () {
  return (
    <CSSTransition timeout={150}>
      <div class={fade}>I am fading in</div>
    </CSSTransition>
  )
}

const {fade} = css({
  fade: {
    '&.enter': {
      opacity: 0,
      '&.enter-active': {
        transition: 'opacity .15s linear',
        opacity: 1
      },
    },
    '&.leave': {
      opacity: 1,
      '&.leave-active': {
        opacity: 0,
        transition: 'opacity .15s linear'
      }
    }
  }
})
```

## License

MIT
