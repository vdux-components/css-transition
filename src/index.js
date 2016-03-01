/**
 * Imports
 */

import applyClasses from '@f/apply-classes'
import Transition from 'vdux-transition'
import element from 'vdux/element'
import map from '@f/map-array'

/**
 * CSSTransition component
 */

function render ({props, children}) {
  const {enter, leave, enterTimeout, leaveTimeout} = props

  assertTimeout(enter, enterTimeout, 'enter')
  assertTimeout(leave, leaveTimeout, 'leave')

  return (
    <Transition>
      {
        map(child => <Child {...props} key={child.key}>{child}</Child>, children)
      }
    </Transition>
  )
}

/**
 * Child component that takes care of adding/removing the classes
 * and calling the didEnter/didLeave functions
 */

const Child = {
  onCreate ({props}) {
    const {transition, enter, enterTimeout} = props
    return dispatch => setTimeout(() => dispatch(transition.didEnter()), enterTimeout)
  },

  render ({props, children}) {
    return children[0]
  },

  onUpdate (prev, next) {
    if (!prev.props.transition.leaving && next.props.transition.leaving) {
      const {transition, leaveTimeout} = next.props
      return dispatch => setTimeout(() => dispatch(transition.didLeave()), leaveTimeout)
    }
  },

  afterRender ({props}, node) {
    const {enter, leave, transition} = props
    const {entering, leaving} = transition

    applyClasses({
      [enter]: entering,
      [leave]: leaving
    }, node)
  }
}

/**
 * Helpers
 */

function assertTimeout (cls, timeout, name) {
  if (cls && timeout === undefined) {
    throw new Error(`<CSSTransition/>: If you specify a ${name} transition you must also specify a ${name} timeout`)
  }
}

/**
 * Exports
 */

export default {
  render
}
