
## npm run dev

```
"dev" ===
"rollup -w -c build/config.js --environment TARGET:web-full-dev",
```


```
'web-full-dev': {
  entry: resolve('web/entry-runtime-with-compiler.js'),
  dest: resolve('dist/vue.js'),
  format: 'umd',
  env: 'development',
  alias: { he: './entity-decoder' },
  banner
},
```

## constructor

- src/platforms/web/entry-runtime-with-compiler.js

```
import Vue from './runtime/index'
~
import Vue from 'core/index'
~
import Vue from './instance/index'
```

- src/core/instance/index.js

```javascript

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
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

console.log(Vue.prototype);
// ./events
// Vue.prototype.$on
// Vue.prototype.$once
// Vue.prototype.$off
// Vue.prototype.$emit
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

```

- src/core/index.js

```javascript
// ./global-api/index
// Vue.config
// Vue.util
// Vue.set
// Vue.delete
// Vue.nextTick
// Vue.options
// Vue.use
// Vue.mixin
// Vue.extend
initGlobalAPI(Vue)

// Vue.prototype.$isServer
Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
})

// Vue.prototype.$ssrContext
Object.defineProperty(Vue.prototype, '$ssrContext', {
  get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
})
```

- src/platforms/web/runtime/index.js

```javascript
Vue.prototype.__patch__
Vue.prototype.$mount
```

- src/platforms/web/entry-runtime-with-compiler.js

```javascript

const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el,
  hydrating
) {
  ...
  return mount.call(this, el, hydrating)
}

Vue.compile = compileToFunctions  // ./compiler/index

```

```javascript
Vue.options = {
    components: {
        KeepAlive,
        Transition,
        TransitionGroup
    },
    directives: {
        model,
        show
    },
    filters: {},
    _base: Vue
}

export default Vue
```

## new Vue

```javascript
// 1. _init in constructor
this._init(options)
```

- src/core/instance/init.js

```javascript
vm._uid = uid++

let startTag, endTag
/* istanbul ignore if */
if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
  startTag = `vue-perf-start:${vm._uid}`
  endTag = `vue-perf-end:${vm._uid}`
  mark(startTag)
}

// a flag to avoid this being observed
vm._isVue = true
// merge options
if (options && options._isComponent) {
  // optimize internal component instantiation
  // since dynamic options merging is pretty slow, and none of the
  // internal component options needs special treatment.
  initInternalComponent(vm, options)
} else {

  // use default strat: shallow copy
  vm.$options = mergeOptions(
    resolveConstructorOptions(vm.constructor), // return Vue.options
    options || {},
    vm
  )
}
/* istanbul ignore else */
if (process.env.NODE_ENV !== 'production') {
  initProxy(vm)
} else {
  vm._renderProxy = vm
}
// expose real self
vm._self = vm

// ./lifecycle
// vm.$parent = parent      (while options.parent && options.parent.abstract)
// vm.$root = parent ? parent.$root : vm
//
// vm.$children = []
// vm.$refs = {}
//
// vm._watcher = null
// vm._inactive = null
// vm._directInactive = false
// vm._isMounted = false
// vm._isDestroyed = false
// vm._isBeingDestroyed = false
initLifecycle(vm)

// ./event
// vm._events = Object.create(null)
// vm._hasHookEvent = false
initEvents(vm)

// ./render
// vm.$vnode = null
// vm._vnode = null
// vm._staticTrees = null
// vm.$slots
// vm.$scopedSlots
// vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
// vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
initRender(vm)

callHook(vm, 'beforeCreate')

// ./inject
initInjections(vm) // resolve injections before data/props

// ./state
// vm._watchers = []
// call initProps
// call initMethods
// call initData
// call initComputed
// call initWatch
initState(vm)

initProvide(vm) // resolve provide after data/props
callHook(vm, 'created')

if (vm.$options.el) {
  vm.$mount(vm.$options.el)
}
```

- src/core/instance/state.js

```javascript
function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
// proxy this[key] => this._data[key]
/**

function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

*/
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  observe(data, true /* asRootData */)
}
```

- src/core/observer/index.js

```javascript
new Observer(value)
~

constructor (value: any) {
  this.value = value
  this.dep = new Dep()
  this.vmCount = 0
  def(value, '__ob__', this)
  if (Array.isArray(value)) {
    const augment = hasProto
      ? protoAugment
      : copyAugment
    augment(value, arrayMethods, arrayKeys)
    this.observeArray(value)
  } else {
    this.walk(value)
  }
}
~

walk (obj: Object) {
  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i], obj[keys[i]])
  }
}
~

function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val

      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}
```

### vm.$mount
