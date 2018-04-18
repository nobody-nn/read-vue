/* @flow */

import { warn } from 'core/util/index'
import { cached, isUndef, isPlainObject } from 'shared/util'

// TODO: 不懂,返回值只有四个啊
const normalizeEvent = cached((name: string): {
  name: string,
  once: boolean,
  capture: boolean,
  passive: boolean,
  handler?: Function,
  params?: Array<any>,
} => {
  // & 前缀
  const passive = name.charAt(0) === '&'
  name = passive ? name.slice(1) : name
  // ~ 前缀
  const once = name.charAt(0) === '~' // Prefixed last, checked first
  name = once ? name.slice(1) : name
  // ! 前缀
  const capture = name.charAt(0) === '!'
  name = capture ? name.slice(1) : name
  return {
    name,
    once,
    capture,
    passive,
  }
})

export function createFnInvoker(fns: Function | Array<Function>): Function {
  function invoker() {
    // TODO: 这里的invoker是啥？定义的function吗？
    const fns = invoker.fns
    if (Array.isArray(fns)) {
      const cloned = fns.slice()
      for (let i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments)
      }
    } else {
      // return handler return value for single handlers
      return fns(...arguments)
    }
  }
  invoker.fns = fns
  return invoker
}

export function updateListeners(
  on: Object,
  oldOn: Object,
  add: Function,
  remove: Function,
  vm: Component
) {
  let name, def, cur, old, event
  for (name in on) {
    // per current listener
    def = cur = on[name]
    // corresponding old listener
    old = oldOn[name]
    event = normalizeEvent(name) // 返回一个Object
    /* istanbul ignore if */
    if (__WEEX__ && isPlainObject(def)) {
      cur = def.handler
      event.params = def.params
    }
    // handler 未定义
    if (isUndef(cur)) {
      process.env.NODE_ENV !== 'production' &&
        warn(
          `Invalid handler for event "${event.name}": got ` + String(cur),
          vm
        )
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur)
      }
      // TODO: add函数只接收三个参数啊
      add(
        event.name,
        cur,
        event.once,
        event.capture,
        event.passive,
        event.params
      )
    } else if (cur !== old) {
      // 新旧listener不一致时
      // TODO: 不懂为啥这样写
      old.fns = cur
      on[name] = old
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name)
      remove(event.name, oldOn[name], event.capture)
    }
  }
}
