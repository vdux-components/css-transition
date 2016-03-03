/**
 * Imports
 */

import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import removeClass from '@f/remove-class'
import Transition from 'vdux-transition'
import addClass from '@f/add-class'
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
 * Actions
 */

const storeEnterId = createAction('<CSSTransitionChild/>: Store enter id')
const storeLeaveId = createAction('<CSSTrransitionChild/>: Store leave id')

/**
 * Child component that takes care of adding/removing the classes
 * and calling the didEnter/didLeave functions
 */

const Child = {
  onCreate ({props, local, key}) {
    const {transition, enterTimeout} = props
    return dispatch => dispatch(local(storeEnterId)(setTimeout(() => dispatch(transition.didEnter()), enterTimeout)))
  },

  render ({children}) {
    return children[0]
  },

  onUpdate (prev, next) {
    if (!prev.props.transition.leaving && next.props.transition.leaving) {
      const {transition, leaveTimeout} = next.props

      return dispatch => {
        const id = setTimeout(() => dispatch(transition.didLeave()), leaveTimeout)
        dispatch(next.local(storeLeaveId)(id))
      }
    } else if (prev.props.transition.leaving && !next.props.transition.leaving) {
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
    const {name, transition} = props
    const {leaving, entering} = transition
    setTimeout(() => {
      leaving
        ? removeClass(name, node)
        : addClass(name, node)
    })
  }
}

/**
 * Exports
 */

export default {
  render
}
