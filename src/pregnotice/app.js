let util = require('util/util.js')
// Object.assign的Polyfill
if (typeof Object.assign !== 'function') {
  Object.assign = function (target) {
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object')
    }

    target = Object(target)
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index]
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key]
          }
        }
      }
    }
    return target
  }
}

App({
  onLaunch: function () {
    var that = this

    // 校验本地登录信息，如果存在直接取用
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      userInfo = JSON.parse(userInfo)
      this.globalData.userInfo = userInfo
    } else {
      // 暂时不在打开时做强制登录
      // this.getUserInfo()
    }

    // 从本地存储获取预产期
    var pregdate = wx.getStorageSync('pregdate') || ''
    this.updateGlobalPregdate(pregdate)
  },
  onShow: function () {},
  onHide: function () {},
  getUserInfo (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb === 'function' && cb(this.globalData.userInfo)
    } else {
      that.wxLogin()
    }
  },
  updateGlobalPregdate (pregdate) {
    this.globalData.pregdate = pregdate
    this.globalData.pregtoday = util.pregDateFormat.calPregweek(pregdate)
    this.globalData.pregday = util.pregDateFormat.calPregweek(pregdate, 'day')
    this.globalData.pregweek = util.pregDateFormat.calPregweek(pregdate, 'week')
  },
  wxLogin (successCb) {
    let that = this
    // wx.getNetworkType({
    //   success: function (res) {
    //     var networkType = res.networkType // 返回网络类型2g，3g，4g，wifi
    //     if(networkType==='none'){
    //       wx.showModal()
    //     }
    //     console.log('netWorkType', networkType)
    //   }
    // })
    function wxLoginFail (successCb) {
      console.log('loginFail')
      wx.hideToast()
      wx.showModal({
        title: '登录失败',
        confirmText: '重试',
        success (res) {
          if (res.confirm) {
            that.wxLogin(successCb)
          }
        }
      })
    }
    wx.showToast({
      title: '正在登录',
      icon: 'loading',
      duration: 10000
    })
    // 调用登录接口
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: 'https://api.ladybirdedu.com/app/v1/wechat/app/authorize',
            method: 'POST',
            data: {
              code: res.code
            },
            success: function (res) {
              var session = res.data.data.hashKey
              // 从微信获取用户信息
              wx.getUserInfo({
                success: function (res) {
                  that.globalData.userInfo = res.userInfo
                  wx.request({
                    url: 'https://api.ladybirdedu.com/app/v1/user/login',
                    data: {
                      type: 5,
                      code: session,
                      iv: res.iv,
                      encryptedData: res.encryptedData
                    },
                    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    // header: {}, // 设置请求的 header
                    success: function (res) {
                      if (res.data.status === 'success') {
                        wx.showToast({
                          title: '登录成功',
                          icon: 'success',
                          duration: 100
                        })
                        let userInfo = Object.assign(that.globalData.userInfo, {
                          userId: res.data.data.userInfo.id
                        })
                        that.globalData.userInfo = userInfo
                        console.log('userInfo', that.globalData)
                        let pregdate = res.data.data.baby ? res.data.data.baby.pregdate : wx.getStorageSync('pregdate')
                        that.updateGlobalPregdate(pregdate)
                        wx.setStorageSync('userInfo', JSON.stringify(userInfo))
                        if (typeof successCb === 'function') successCb()
                      } else {
                        wxLoginFail(successCb)
                      }
                    },
                    fail: function (res) {
                      wxLoginFail(successCb)
                    }
                  })
                },
                fail: function (res) {
                  wxLoginFail(successCb)
                }
              })
            },
            fail: function (res) {
              wxLoginFail(successCb)
            }
          })
        } else {
          wxLoginFail(successCb)
        }
      },
      fail: function (res) {
        wxLoginFail(successCb)
      }
    })
  },
  askForWxLogin (successCb, failCb, hideModal) {
    let that = this
    if (this.globalData.userInfo) return false
    if (hideModal) {
      that.LoginSetting(successCb)
    } else {
      wx.showModal({
        title: '请先登录',
        confirmText: '登录',
        cancelText: '取消',
        success (res) {
          if (res.confirm) {
            that.LoginSetting(successCb)
          } else {
            // wx.navigateBack()
            if (typeof failCb === 'function') failCb()
          }
        }
      })
    }
  },
  LoginSetting(successCb){
    let that = this
    wx.getSetting({
      success: (res) => {
        if(res.authSetting['scope.userInfo']==false){
          wx.openSetting({
            success: (res) => {
              that.wxLogin(successCb)
            }
          })
        } else {
          that.wxLogin(successCb)          
        }
      }
    })
  },
  askForLogout (successCb) {
    let that = this
    wx.showModal({
      title: '退出登录',
      success (res) {
        if (res.confirm) {
          wx.removeStorage({
            key: 'userInfo',
            success () {
              that.globalData.userInfo = ''
              successCb()
            }
          })
        }
      }
    })
  },
  globalData: {
    pregdate: '',
    pregtoday: '',
    pregweek: '',
    pregday: '',
    userInfo: '',
    needSyncData: false
  }
})
