let api = require('../../util/api.js')
let app = getApp()
let globalData = app.globalData

Page({
  data: {
    orderInfo: {},
    outdated: false,
    id: '',
    urlType: 'url2',
    baseUrl: 'http://www.ladybirdedu.com//pregnotice/images/wx-static/',
    name: '',
    phone: '',
    address: '',
    noData: {
      desc: '订单已失效',
      img: 'http://www.ladybirdedu.com//pregnotice/images/wx-static/outdated.png',
      navToText: '查看商品列表',
      navTo: '../sale/list'
    }
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.updateData()
    let that = this
    wx.chooseAddress({
      success: function (res) {
        that.setData({
          name: res.userName,
          phone: res.telNumber,
          address: res.cityName + res.countyName + res.detailInfo
        })
      }
    })
  },
  bindName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindAddress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  payNow: function () {
    let verify = /^1[3|4|5|7|8][0-9]{9}$/
    if (!this.data.name || !this.data.phone || !this.data.address) {
      wx.showToast({
        title: '请完善个人信息',
        image: '../../image/wrong.png',
        duration: 1000
      })
    } else if (!verify.test(this.data.phone)) {
      wx.showToast({
        title: '手机号格式错误',
        image: '../../image/wrong.png',
        duration: 1000
      })
    } else {
      wx.showLoading({
        title: '下单中'
      })
      let that = this
      api.postData({
        url: 'order/send',
        data: {
          user_id: globalData.userInfo.userId,
          goods_id: that.data.id,
          name: that.data.name,
          phone: that.data.phone,
          baby_num: 1,
          address: that.data.address,
          pregdate: '2017-08-08',
          wechat_type: 'wx_app',
          trade_type: 'JSAPI'
        },
        that,
        success: function (res) {
          wx.hideLoading()
          let data = res.data.data
          wx.requestPayment({
            'timeStamp': data.timeStamp,
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signType,
            'paySign': data.paySign,
            'success': function (res) {
              wx.navigateTo({
                url: 'result?orderId=' + data.tradeNo + '&id=' + that.data.id
              })
            },
            'fail': function (res) {
              console.log(data.tradeNo)
              wx.showToast({
                title: '支付取消',
                image: '../../image/wrong.png',
                duration: 1000
              })
            }
          })
        },
        fail: function () {
          wx.hideLoading()
          wx.showToast({
            title: '下单失败',
            image: '../../image/wrong.png',
            duration: 1000
          })
        }
      })
    }
  },
  updateData: function () {
    var that = this
    api.fetchData({
      url: 'goods/detail/' + that.data.id,
      data: {},
      that,
      success: function (data) {
        console.log(data)
        that.setData({
          orderInfo: data,
          outdated: !data.title
        })
      }
    })
  }
})
