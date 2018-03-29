// 每个组件以这种形式对外暴露
import { register } from 'utils'

var components = {
  InviteButton: require('./inviteButton.vue'),
  CommonAlert: require('./commonAlert.vue')
}

Object.keys(components).map(function (key) {
  components[key] = register(components[key])
  return components
})

module.exports = components
