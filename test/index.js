/**
 * Imports
 */

import polyfill from 'babel-polyfill'
import test from 'tape-co'
import vdux from 'vdux/dom'
import sleep from '@f/sleep'
import logger from 'redux-logger'
import element from 'vdux/element'
import CSSTransition from '../src'

/**
 * Tests
 */

test('should work', function *(t) {
  function Child () { return <div></div> }
  const app = run(state => <CSSTransition timeout={50}>{state.children}</CSSTransition>, {children: [<Child key='test' />]})

  t.ok($('.enter'), 'adds enter class')
  yield sleep(0)
  t.ok($('.enter-active'), 'adds enter class')

  yield sleep(75)
  t.notOk($('.enter'), 'removes enter class')
  t.notOk($('.enter-active'), 'removes enter-active class')

  app.dispatch(removeSelf())
  yield sleep(0)
  t.ok($('.leave'), 'adds leave class')
  yield sleep(0)
  t.ok($('.leave-active'), 'adds leave-active class')

  yield sleep(75)
  t.notOk($('.leave'), 'removes leave class')
  t.notOk($('.leave-active'), 'removes leave-active class')

  app.stop()
})

test('should work if nothing is passed', function *(t) {
  function Child () { return <div class='test'></div> }
  const app = run(state => <CSSTransition>{state.children}</CSSTransition>, {children: [<Child key='test' />]})

  t.ok($('.test'), 'child exists')
  app.dispatch(removeSelf())

  yield sleep(100)
  t.notOk($('.test'), 'child was removed')
  app.stop()
})

test('should work if component leaves before it finishes entering', function *(t) {
  function Child () { return <div class='test'></div> }
  const app = run(state => <CSSTransition timeout={{enter: 1000, leave: 100}}>{state.children}</CSSTransition>, {children: [<Child key='test' />]})

  t.ok($('.test'), 'child exists')
  app.dispatch(removeSelf())

  yield sleep(150)
  t.notOk($('.test'), 'child was removed')
  app.dispatch(addSelf(<Child key='test' />))

  yield sleep(0)
  t.ok($('.test'), 'child exists')
  app.dispatch(removeSelf())

  yield sleep(150)
  t.notOk($('.test'), 'child was removed')
  app.stop()
})

/**
 * Helpers
 */

function run (app, initialState = {}) {
  return vdux({
    app,
    reducer,
    // middleware: [logger()],
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

function addSelf (payload) {
  return {
    type: 'add self',
    payload
  }
}

function reducer (state, action) {
  switch (action.type) {
    case 'remove self':
      return {
        ...state,
        children: []
      }
    case 'add self':
      return {
        ...state,
        children: [...state.children, action.payload]
      }
    default:
      return state
  }
}
