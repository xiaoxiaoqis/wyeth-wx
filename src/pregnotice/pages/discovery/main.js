let api = require('../../util/api.js')
let app = getApp()
let globalData = app.globalData
const ImgLoader = require('../../components/img-loader/img-loader.js')
Page({
  data: {
    list: [],
    limit: 20,
    loadTimes: 0,
    city: '北京市',
    unsupported: true,
    urlType: 'url2',
    allLoaded: false,
    res: [
      {
        name: '建档指南',
        content: '大小档全攻略',
        image: 'https://static.ladybirdedu.com/upload_new/images/common/20170614/YIh67DoAQsoOIrXhyrfzuWSzyM3s87hLYTpSLkVX.png',
        status: 'hot',
        url: 'filing/guide'
      },
      {
        name: '周边医院',
        status: '',
        content: '最新建卡动态',
        image: 'https://static.ladybirdedu.com/upload_new/images/common/20170614/HaWyrfteWYXzBSoZ9VAWXS62awz2CfvlG19Fxh5p.png',
        url: 'hospital/list'
      },
      {
        name: '基因检测',
        status: '',
        content: '4款产品热卖中',
        image: 'https://static.ladybirdedu.com/upload_new/images/common/20170615/i7pgxfTQ7nvTdAQAgh1cjcpA5YE8B1aeD4JlfXLM.png',
        url: 'sale/list'
      },
      {
        name: '无创DNA',
        status: 'hot',
        content: '团购仅需1488',
        image: 'https://static.ladybirdedu.com/upload_new/images/common/20170614/9fCTjlDnaXyh4U3ebNBH2jbrhUELTo4raT2QmGSA.png',
        url: 'sale/item?id=0NQpeR8O'

      }
    ],
    group: [
      {
        name: '专家答疑群',
        content: '每天都有专家坐镇答疑',
        image: 'http://www.qubaobei.com/uploadnew/cms/20170717/145614177343_s.jpg'
      },
      {
        name: '同期孕妈交流群',
        content: '同月预产期的妈妈都在这里',
        image: 'http://www.qubaobei.com/uploadnew/cms/20170717/145614177343_s.jpg'
      },
      {
        name: '产检讨论群',
        content: '唐筛、四维、无创关于产检这边都有',
        image: 'http://www.qubaobei.com/uploadnew/cms/20170717/145614177343_s.jpg'
      }
    ]
  },
  onLoad: function (options) {
    this.getLocation()
    this.updateData()
  },
  imageOnLoad (err, data) {
    const list = this.data.list.map(item => {
      if (item.image === data.src) { item.loaded = true }
      return item
    })
    this.setData({ list })
  },
  updateData: function () {
    var that = this
    api.fetchListData({
      url: 'goods/list',
      data: {group:2},
      that,
      success: function (data) {
        data.forEach(function (ele) {
          ele.loaded = false
        }, this)
        that.setData({
          list: that.data.list.concat(data)
        })
        that.imgLoader = new ImgLoader(that, that.imageOnLoad.bind(that))
        that.data.list.forEach(item => {
          that.imgLoader.load(item.image)
        })
      }
    })
  },
  getLocation () {
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude
        wx.request({
          url: 'https://restapi.amap.com/v3/geocode/regeo',
          data: {
            key: '098e89448f04027df48009ccf8556351',
            location: longitude + ',' + latitude
          },
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            console.log(res)
            let city = res.data.regeocode.addressComponent.city
            that.setData({
              city,
              unsupported: city !== '北京市'
            })
          }
        })
      }
    })
  }
})
