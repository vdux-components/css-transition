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

  const app = run(state => <CSSTransition name='fade' enterTimeout={50} leaveTimeout={50}>{state.children}</CSSTransition>, {children: [<Child key='test' />]})

  t.ok($('.fade'), 'adds fade class')
  setTimeout(() => {
    app.dispatch(removeSelf())

    setTimeout(() => {
      t.notOk($('.fade'), 'removes fade class')
      app.stop()
      t.end()
    }, 75)
  }, 75)
})

test('should work if nothing is passed', t => {
  function Child () {
    return <div class='test'></div>
  }

  const app = run(state => <CSSTransition>{state.children}</CSSTransition>, {children: [<Child key='test' />]})

  t.ok($('.test'), 'child exists')
  app.dispatch(removeSelf())
  setTimeout(() => {
    t.notOk($('.test'), 'child was removed')
    app.stop()
    t.end()
  }, 100)
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
