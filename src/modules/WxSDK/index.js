/**
 * Created by FJC on 2017/8/15.
 */

import network from '../network/network'
import data from '../../data/index'
import event from '../event'

let WeixinSDK = {
  initConfig: function () {
    var self = this
    let url = self.options.requrl
    let t = parseInt(new Date().getTime() / 1000)
    network.getSignature(url, t, function (ret) {
      if (ret.status === 200 && ret.data) {
        console.log('ret', ret)
        let config = ret.data.package
        config.debug = self.options.debug
        config.jsApiList = Object.keys(self.options.api)
        wx.config(config)

        wx.ready(function () {
          Object.keys(self.options.api).map(function (listener) {
            wx[listener](self.options.api[listener])
          })
        })
        wx.error(function (res) {
          // alert(res.errMsg);
        })
      }
    })
  },
  init: function (options) {
    let defaultOptions = {
      debug: window.shareDebug
    }

    this.options = Object.assign(defaultOptions, options)
    this.initConfig()
  }
}

function GetQueryString (variable) {
  var query = window.location.search.substring(1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] === variable) { return pair[1] }
  }
  return ''
}

let WeixinShare = {
  share: function (title, desc, img, link, success, fail) {
    // 分享设置
    var userInfo = data.store('userInfo')
    if (userInfo === null) {
      return
    }
    var linkUrl = link + '&from_openid=' + userInfo.openid
    let test = GetQueryString('test')
    if (test !== '') {
      linkUrl = linkUrl + '&test=' + test
    }

    var localUrl = document.URL
    if (localUrl.indexOf('#') > 0) {
      localUrl = localUrl.slice(0, localUrl.indexOf('#'))
    }
    let options = {
      requrl: localUrl,
      api: {
        onMenuShareTimeline: {
          title: title,
          desc: desc,
          link: linkUrl,
          imgUrl: img,
          trigger: function (res) {
            // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
          },
          success: function (res) {
            event.sendEvent('toast', { type: 'success', text: '分享成功' })
            success()
            // event.sendEvent('toast', { type: "MQ", text: '分享成功 MQ+20' })
          },
          cancel: function (res) {

          },
          fail: function (res) {
            fail()
          }
        },
        onMenuShareAppMessage: {
          title: title,
          desc: desc,
          link: linkUrl,
          imgUrl: img,
          trigger: function (res) {
            // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
          },
          success: function (res) {
            event.sendEvent('toast', { type: 'success', text: '分享成功' })
            success()
          },
          cancel: function (res) {
          },
          fail: function (res) {
            fail()
          }
        }
      }
    }
    WeixinSDK.init(options)
  }
}

module.exports = {
  WxSDK: WeixinSDK,
  WxShare: WeixinShare
}
