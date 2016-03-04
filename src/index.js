/**
 * Imports
 */

import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import removeClass from '@f/remove-class'
import Transition from 'vdux-transition'
import isNumber from '@f/is-number'
import addClass from '@f/add-class'
import element from 'vdux/element'
import map from '@f/map-array'

/**
 * CSSTransition component
 */

function render ({props, children}) {
  return (
    <Transition>
      {
        map(child => <Child {...props} key={child.key}>{child}</Child>, children)
      }
    </Transition>
  )
}

/**
 * Actions
 */

const storeEnterId = createAction('<CSSTransitionChild/>: Store enter id')
const storeLeaveId = createAction('<CSSTrransitionChild/>: Store leave id')

/**
 * Child component that takes care of adding/removing the classes
 * and calling the didEnter/didLeave functions
 */

const Child = {
  getProps (props) {
    return {...props, timeout: props.timeout || 0}
  },

  onCreate ({props, local, key}) {
    const {$transition, timeout} = props
    const {didEnter} = $transition
    const enterTimeout = getTimeout(timeout, 'enter')

    return dispatch => dispatch(local(storeEnterId)(setTimeout(() => dispatch(didEnter()), enterTimeout)))
  },

  render ({children}) {
    return children[0]
  },

  onUpdate (prev, next) {
    if (!prev.props.$transition.leaving && next.props.$transition.leaving) {
      const {$transition, timeout} = next.props
      const {didLeave} = $transition
      const leaveTimeout = getTimeout(timeout, 'leave')

      return dispatch => {
        const id = setTimeout(() => dispatch(didLeave()), leaveTimeout)
        dispatch(next.local(storeLeaveId)(id))
      }
    } else if (prev.props.$transition.leaving && !next.props.$transition.leaving) {
      return () => clearTimeout(next.state.leaveId)
    }
  },

  reducer: handleActions({
    [storeEnterId]: (state, enterId) => ({...state, enterId}),
    [storeLeaveId]: (state, leaveId) => ({...state, leaveId})
  }),

  onRemove ({key, state}) {
    return () => {
      clearTimeout(state.enterId)
      clearTimeout(state.leaveId)
    }
  },

  afterRender ({props}, node) {
    const {$transition} = props
    const {leaving, entering} = $transition

    if (entering) {
      addClass('enter', node)
      setTimeout(() => addClass('enter-active', node))
    } else {
      removeClass('enter', node)
      removeClass('enter-active', node)
    }

    if (leaving) {
      addClass('leave', node)
      setTimeout(() => addClass('leave-active', node))
    } else {
      removeClass('leave', node)
      removeClass('leave-active', node)
    }
  }
}

/**
 * Helpers
 */

function getTimeout (timeout, name) {
  return isNumber(timeout) ? timeout : timeout[name]
}

/**
 * Exports
 */

export default {
  render
}
