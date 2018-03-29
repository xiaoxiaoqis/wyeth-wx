let api = require('../../util/api.js')
let app = getApp()
let globalData = app.globalData
let WxParse = require('../../components/wxParse/wxParse.js')
const ImgLoader = require('../../components/img-loader/img-loader.js')

Page({
  data: {
    product: {},
    id: '',
    urlType: 'url2',
    baseUrl: 'http://www.ladybirdedu.com//pregnotice/images/wx-static/',
    recommend: [],
    shareMsg: {},
    platform:''
    // fixed: '',
    // showContact: false,
    // animation: ''
  },
  onLoad: function (options) {
    this.setData({
      id: options.id,
      platform: options.platform
    })
  },
  onReady: function () {
    this.updateData()
  },
  onShareAppMessage: function () {
    return this.data.shareMsg
  },
  // handelMask () {
  //   this.setData({
  //     showContact: !this.data.showContact,
  //     fixed: this.data.fixed === '' ? 'fixed' : '',
  //     animation: this.data.showContact ? '' : 'ease-in'
  //   })
  // },
gotoCa:function(){
  if(this.data.id =='4kQM8yV6'){
    wx.navigateTo({
      url: 'item?id=ANyVgQ02'
    })
  }
},
  toPay: function () {
    if (!globalData.userInfo.userId) {
      app.askForWxLogin(() => {
        wx.navigateTo({
          url: 'confirm?id=' + this.data.id
        })
      }, () => {
        wx.navigateBack()
      })
    } else {
      wx.navigateTo({
        url: 'confirm?id=' + this.data.id
      })
    }
  },
  imageOnLoad (err, data) {
    this.setData({
      'product.loaded': this.data.product.banner[0] === data.src
    })
  },
  updateData: function () {
    var that = this
    api.fetchData({
      url: 'goods/detail/' + that.data.id,
      data: {},
      that,
      success: function (data) {
        data.loaded = false
        that.setData({
          product: data,
          recommend: data.recommend,
          shareMsg: {
            title: `仅需${data.price}元|${data.title}`,
            desc: `卫生部临检满分医检所最新基因检测技术，为孕期护航`,
            path: `../sale/item?id=${data.id || 0}&sharedBy${globalData.userInfo.userId || 0}`
          }
        })
        that.imgLoader = new ImgLoader(that, that.imageOnLoad.bind(that))
        that.imgLoader.load(that.data.product.banner[0])
        console.log(that.data.product)
        let article = data.content
        WxParse.wxParse('article', 'html', article, that)
        var serviceSteps = data.intro.serviceSteps
        for (let i = 0; i < serviceSteps.length; i++) {
          WxParse.wxParse('step' + i, 'html', serviceSteps[i], that)
          if (i === serviceSteps.length - 1) {
            WxParse.wxParseTemArray('stepArray', 'step', serviceSteps.length, that)
          }
        }
      }
    })
  }
})
