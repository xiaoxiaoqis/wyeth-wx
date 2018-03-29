// 每个组件以这种形式对外暴露
import { register } from 'utils'
var list = {
  OHSPage: require('./ohs-page.vue'),
  OHSFullPage: require('./ohs-fullpage.vue')
}

Object.keys(list).map(function (key) {
  list[key] = register(list[key])
})
module.exports = list
