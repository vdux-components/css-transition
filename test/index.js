/**
 * Imports
 */

import test from 'tape'
import vdux from 'vdux/dom'
import element from 'vdux/element'
import CSSTransition from '../src'

/**
 * Tests
 */

test('should work', t => {
  function Child () {
    return <div></div>
  }

  const app = run(state => <CSSTransition enter='entering' leave='leaving' enterTimeout={50} leaveTimeout={50}>{state.children}</CSSTransition>, {children: [<Child key='test' />]})

  t.ok($('.entering'), 'adds entering class')
  setTimeout(() => {
    t.notOk($('.entering'), 'removes entering class')
    app.dispatch(removeSelf())
    setTimeout(() => {
      t.ok($('.leaving'), 'adds leaving class')

      setTimeout(() => {
        t.notOk($('.leaving'), 'removes leaving class')
        app.stop()
        t.end()
      }, 75)
    })
  }, 75)
})

/**
 * Helpers
 */

function run (app, initialState = {}) {
  return vdux({
    app,
    reducer,
    initialState
  })
}

function $ (selector) {
  return document.querySelector(selector)
}

function removeSelf () {
  return {
    type: 'remove self'
  }
}

function reducer (state, action) {
  switch (action.type) {
    case 'remove self':
      return {
        ...state,
        children: []
      }
    default:
      return state
  }
}