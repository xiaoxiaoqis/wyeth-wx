/**
 * Created by zhangyi on 2017/7/20.
 * Desc: 网络接口
 */
// import Promise from 'bluebird'
import network from './network'
import config from '../../config.json'
import data from '../../data'

let depends = {}
let fetches = {}

Object.keys(config.depends).map((key) => {
  let depend = { api: config.depends[key] }

  key.split('.').map((splitKey, idx) => {
    if (idx === 0) {
      depends[splitKey] = depend
    } else {
      if (!depend.params) {
        depend.params = []
      }

      depend.params.push(splitKey)
    }
  })
})

function _apiDepend (api) {
  return depends[api.split('.')[0]]
}

function _apiToMethod (api) {
  const depend = _apiDepend(api)

  if (!depend || !depend.api || !depend.api[0]) {
    throw new Error(`[ERROR] no depend or method in _apiToUrl @network/index where api = ${api}`)
  }

  return depend.api[0]
}

function _apiToUrl (api) {
  const depend = _apiDepend(api)
  // const params = _apiToParams(api)

  if (!depend || !depend.api || !depend.api[1]) {
    throw new Error(`[ERROR] no depend or path in _apiToUrl @network/index where api = ${api}`)
  }

  // if (params) {
  //   return Object.keys(params).reduce((url, key) => {
  //     return `${url}&${key} = ${params[key]}`
  //   }, depend.api[1])
  // }
  // else {
  return depend.api[1]

  // }
}

function _apiToFresh (api) {
  const depend = _apiDepend(api)

  if (!depend || !depend.api || depend.api.length < 3) {
    return true
  }

  return depend.api[2]
}

function _apiToParams (api) {
  const depend = _apiDepend(api)

  if (!depend || !depend.params) {
    return null
  }

  let params = {}

  api.split('.').map((val, idx) => {
    if (idx !== 0) {
      if (depend.params[idx - 1]) {
        params[depend.params[idx - 1]] = val
      }
    }
  })

  return params
}

function _reset (api) {
  fetches[api] = {
    isFetch: false,
    handlers: []
  }
}

function _dispath (api, data) {
  fetches[api].handlers.map((handler) => {
    handler(data)
  })
  _reset(api)
}

function _register (api, handler) {
  fetches[api].handlers.push(handler)
}

function _dofetch (api) {
  return new Promise((resolve, reject) => {
    if (!fetches[api]) {
      _reset(api)
    }

    if (fetches[api].isFetch) {
      _register(api, (d) => {
        resolve(d)
      })
    } else {
      fetches[api].isFetch = true
      network.request(_apiToMethod(api), _apiToUrl(api), _apiToParams(api), (d) => {
        console.log(' ====', d)
        if (d.ret === 1) {
          data.store(api, d)
          _dispath(api, d)
          resolve(d)
        } else {
          reject(new Error(d.msg))
        }
        _reset(api)
      })
    }
  })
}

export function fetch (api, dofetch) {
  let val = data.store(api)

  if (!dofetch && val) {
    return Promise.resolve(val)
  }

  return _dofetch(api)
}

export function fetchAll (apis) {
  let promises = []
  apis.map((api) => {
    promises.push(fetch(api, _apiToFresh(api)))
  })

  return Promise.all(promises)
}
