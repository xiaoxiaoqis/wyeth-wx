let app = getApp()
let globalData = app.globalData
let WxParse = require('../../components/wxParse/wxParse.js')
let api = require('../../util/api.js')

Page({
  data: {
    orderId: '',
    name: '',
    phone: '',
    isDone: false,
    startDate: '',
    endDate: '',
    urlType: 'url2',
    timeValue: '采血时间，8：00-17：45',
    dateValue: '采血日期，可预约15天内时间',
    timeSelected: false,
    dateSelected: false,
    timeList: [],
    placeList: [['海淀区交大东路36号昌盛门诊部', '昌平区回龙观回南北路佰嘉城北门底商101', '朝阳区大郊亭桥东2000米广渠路南侧观音惠园1号楼'],['玄武区珠江路318号']],
    multiArray: [['北京市', '南京市'], ['橙邻橙里昌盛门诊部', '橙邻橙里诚济源诊所', '北京世纪晨光医院']],
    multiIndex: [0, 0],
  },
  onLoad: function (options) {
    let that = this
    this.setData({
      orderId: options.orderId,
      date: that.getDate(new Date()),
      startDate: that.getDate(new Date()),
      endDate: that.getDate(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)),
      timeList: that.gettimeList()
    })
  },
  bindMultiPickerChange: function (e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['橙邻橙里昌盛门诊部', '橙邻橙里诚济源诊所', '北京世纪晨光医院'];
            break;
          case 1:
            data.multiArray[1] = ['玄武中医院'];
            break;
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },
  gettimeList () {
    let hourArray = ['08', '09', '10', '11', '12', '14', '15', '16', '17']
    let array = []
    let minArray = ['00', '15', '30', '45']
    hourArray.forEach((el) => {
      for (let i = 0; i < 4; i++) {
        array.push(el + ':' + minArray[i])
      }
    })
    return array
  },
  getDate (val) {
    let year = val.getFullYear()
    let month = (val.getMonth() + 1) <= 9 ? '0' + (val.getMonth() + 1) : (val.getMonth() + 1)
    let day = val.getDate()
    return year + '-' + month + '-' + day
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
  bindDateChange: function (e) {
    this.setData({
      dateValue: e.detail.value,
      dateSelected: true
    })
  },
  bindTimeChange: function (e) {
    let that = this
    this.setData({
      timeValue: that.data.timeList[e.detail.value],
      timeSelected: true
    })
  },
  makeAppointment () {
    let that = this
    let verify = /^1[3|4|5|7|8][0-9]{9}$/
    if (!this.data.name || !this.data.phone) {
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
    } else if (!this.data.timeSelected || !this.data.dateSelected) {
      wx.showToast({
        title: '请选择日期时间',
        image: '../../image/wrong.png',
        duration: 1000
      })
    } else {
      wx.showLoading({
        title: '提交预约...'
      })
      let data = {
        name: that.data.name,
        user_id: globalData.userInfo.userId,
        order_id: that.data.orderId,
        phone: that.data.phone,
        date: that.data.dateValue + ' ' + that.data.timeValue,
        place: that.data.multiArray[1][that.data.multiIndex[1]]
      }
      api.postData({
        url: 'order/appointment',
        data,
        that,
        success (res) {
          wx.hideLoading()
          that.setData({
            isDone: true,
            appointmentDetail: [{
              label: '预约时间',
              value: that.data.dateValue + ' ' + that.data.timeValue
            }, {
              label: '采血地点',
              value: that.data.multiArray[1][that.data.multiIndex[1]]
            }, {
              label: '温馨提示',
              value: '采血无需空腹，正常饮食即可。若有变更，请联系微信客服：yunqitixing1。'
            }]
          })
        },
        fail (res) {
          wx.hideLoading()
          wx.showToast({
            title: '预约失败',
            image: '../../image/wrong.png',
            duration: 1000
          })
        }
      })
    }
  }
})
