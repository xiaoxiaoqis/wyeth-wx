// 本地数据存储的大小限制为 10MB

var store = {
  /*
    数据存储(异步)
    ·将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个异步接口。

    ·传入
    参数	类型	必填	说明
    key	String	是	本地缓存中的指定的 key
    data	Object/String	是	需要存储的内容
    success	Function	否	接口调用成功的回调函数
    fail	Function	否	接口调用失败的回调函数
    complete	Function	否	接口调用结束的回调函数（调用成功、失败都会执行）
  */
  setItem(key, value, callback) {
    console.log('storage-setItem key:', key)

    wx.setStorage({
      key: key,
      data: value,
      success: function (res) {
        console.log('存储成功：', res)

        callback && callback({ ret: 1 })
      },
      fail: function (error) {
        console.log('存储失败：', error)
        callback && callback({ ret: -1, msg: error.errMsg })

      },
      complete: function () {

      }
    })
  },
  /*
    数据存储(同步)
  */
  setItemSync(key, value) {
    try {
      wx.setStorageSync(key, value)
    } catch (e) {
      console.log(e)
    }
  },
  /*
  数据读取（异步）
  从本地缓存中异步获取指定 key 对应的内容。

  ·传入
  参数	类型	必填	说明
  key	String	是	本地缓存中的指定的 key
  success	Function	是	接口调用的回调函数,res = {data: key对应的内容}
  fail	Function	否	接口调用失败的回调函数
  complete	Function	否	接口调用结束的回调函数（调用成功、失败都会执行）
  success返回参数说明：

  ·返回
  参数	类型	说明
  data	String	key对应的内容

  */
  getItem(key, callback) {
    console.log('storage-getItem key:', key)

    wx.getStorage({
      key: key,
      success: function (res) {
        console.log('读取成功：', res)

        callback && callback({ ret: 1, result: 'success', data: res.data })
      },
      fail: function (error) {
        console.log('读取失败：', error)
        callback && callback({ ret: -1, result: 'failed', msg: error.errMsg })

      },
      complete: function () {

      }
    })
  },
  /*
    数据读取（同步）
  */
  getItemSync(key) {
    try {
      var value = wx.getStorageSync(key)
      if (value) {
        return value
      } else {
        return null
      }
    } catch (e) {
      console.log(e)
    }
  },
  /*
    移除数据（异步）
    ·从本地缓存中异步移除指定 key 。

    参数	类型	必填	说明
    key	String	是	本地缓存中的指定的 key
    success	Function	是	接口调用的回调函数
    fail	Function	否	接口调用失败的回调函数
    complete	Function	否	接口调用结束的回调函数（调用成功、失败都会执行）
  */
  removeItem(key, callback) {
    console.log('storage-removeItem key:', key)

    wx.removeStorage({
      key: key,
      success: function (res) {
        console.log('移除成功：', res)

        callback && callback({ ret: 1, data: res.data })
      },
      fail: function (error) {
        console.log('移除失败：', error)
        callback && callback({ ret: -1, msg: error.errMsg })

      },
      complete: function () {

      }
    })
  },
  /*
  移除数据（同步）
  */
  removeItemSync(key) {
    try {
      wx.removeStorageSync(key)
    } catch (e) {
      console.log(e)
    }
  },
  /*
  清理本地数据缓存。

  sync 是否同步
  */
  clearAll(sync) {
    if (sync) {
      try {
        wx.clearStorageSync()
      } catch (e) {
        console.log(e)
      }
    }else{
      wx.clearStorage()
    }
  },
  globalData: function () {
    var app = getApp()
    return app.globalData
  }
}

module.exports = store
