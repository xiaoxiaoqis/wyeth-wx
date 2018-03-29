/**
 * Created by FJC on 2017/9/14.
 */
// 每个组件以这种形式对外暴露
import { register } from 'utils'

var components = {
  OHSQuestionHeader: require('./ohs-question-header.vue'),
  OHSQuestionContent: require('./ohs-question-content.vue')
}

Object.keys(components).map(function (key) {
  components[key] = register(components[key])
  return components
})

module.exports = components
