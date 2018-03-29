/**
 * Created by zhangyi on 2017/7/25.
 * Desc:
 */
import store from './store'

function _store (keys, val) {
  if (typeof val === 'undefined') {
    let keysTemp = keys.split('.')

    keys = []
    if (keysTemp.length > 2) {
      for (let i = 0; i < keysTemp.length; i++) {
        if (i > 1) {
          keys[1] = keys[1] + '.' + keysTemp[i]
        } else {
          keys[i] = keysTemp[i]
        }
      }
    } else {
      keys = keysTemp
    }

    return keys.reduce((v, k) => {
      if (v && v.hasOwnProperty(k)) {
        return v[k]
      } else {
        return null
      }
    }, store.state)
  } else {
    store.commit('set', {
      keys,
      val
    })
  }
}

export default {
  store: _store
}
