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
  const {name, enterTimeout, leaveTimeout} = props

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
    const {transition, enterTimeout} = props
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
    const {name, transition} = props
    const {leaving} = transition

    applyClasses({
      [name]: !leaving
    }, node)
  }
}

/**
 * Exports
 */

export default {
  render
}
