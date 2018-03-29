
var network = {
  request: function (obj) {
    wx.request({
      url: obj.url,
      data: obj.data,
      method: obj.method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: obj.header,
      success: function (res) {        
        obj.success && obj.success(res)
      },
      fail: function (errMsg) {
        var error = {
          ret: -1,
          msg: (errMsg ? errMsg : '请求失败')
        }
        
        obj.fail && obj.fail(error)
      },
      complete: function () {
        obj.complete && obj.complete()
      }
    })
  }
}

module.exports = network
