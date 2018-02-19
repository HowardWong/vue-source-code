import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // 1. _init in constructor
  this._init(options)
}

// ./init
// Vue.prototype._init  entry function
initMixin(Vue)

// ./state
// Vue.prototype.$set     ../observer/index/set
// Vue.prototype.$delete  ../observer/index/delete
// Vue.prototype.$watch   watch function
// Vue.prototype.$data    return this._data
// Vue.prototype.$props   return this._props
stateMixin(Vue)

// ./events
// Vue._events          Object.create(null)
// Vue._hasHookEvent    false
eventsMixin(Vue)

// ./liftcycle
// Vue.prototype._update
// Vue.prototype.$forceUpdate
// Vue.prototype.$destroy
lifecycleMixin(Vue)

// ./render
// Vue.prototype.$nextTick
// Vue.prototype._render
renderMixin(Vue)

export default Vue
