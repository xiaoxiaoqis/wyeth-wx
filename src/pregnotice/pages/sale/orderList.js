let api = require('../../util/api.js')
let app = getApp()
let globalData = app.globalData

Page({
  data: {
    urlType: 'url2',
    list: [],
    length: 3,
    status: [
      ['等待支付', '支付成功，请等待查收DNA样本采集工具', '已收到检测样本，实验室检测中', '检测完成，出具报告', '服务完成，纸质报告已寄出', '待评价', '已评价'],
      ['等待支付', '支付成功', '已采血，实验室检测中', '检测完成，出具报告', '服务完成，纸质报告已寄出', '待评价', '已评价']
    ],
    hasOrder: true,
    isLogin: true,
    noData: {
      desc: '暂无订单信息',
      img: 'http://www.ladybirdedu.com//pregnotice/images/wx-static/empty-cart.png',
      navToText: '查看正在热卖',
      navTo: '../sale/list'
    }
  },
  onLoad: function (options) {
    this.setData({
      isLogin: !!globalData.userInfo.userId
    })
    this.updateData()
  },
  login: function () {
    app.wxLogin(() => {
      this.setData({
        isLogin: true
      })
      this.updateData()
    })
  },
  updateData: function () {
    var that = this
    api.fetchData({
      url: 'order/user',
      data: {user_id: globalData.userInfo.userId, page: 1},
      that,
      success: function (data) {
        console.log(data)
        that.setData({
          list: data.items,
          hasOrder: data.items.length > 0
        })
      }
    })
  }
})
