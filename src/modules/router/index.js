const API = require('../../lib/api')

var router = {
  push:function (obj) {
    API.push(obj)
  },
  replace: function (obj) {
    API.replace(obj)
  },
  pop: function (delta) {
    API.pop(delta)
  },
  reLaunch: function (obj){
    API.reLaunch(obj)
  },
  switchTab: function (obj){
    API.switchTab(obj)
  }
}

module.exports = router
