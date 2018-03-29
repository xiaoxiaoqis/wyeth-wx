let app = getApp()
let globalData = app.globalData
let util = require('../../util/util.js')
let today = util.pregDateFormat.getFormatDate()
Page({
  data: {
    isTest: false,
    sexList: [{name: '1', value: '男宝宝', checked: true}, {name: '2', value: '女宝宝'}],
    sex: 1,
    pregdate: '',
    surname: '',
    name: '',
    word: '',
    loyalSur: false,
    loyalName: false,
    loyalPregdate: false,
    pregdateRangeEnd: '',
    pregdateRangeStart: ''
  },
  onLoad: function (options) {
    console.log(globalData)
    let isTest = options.testName === '1'
    let pregdate = globalData.pregdate ? globalData.pregdate : '请选择宝宝的预产期'
    let that = this
    this.setData({
      isTest,
      pregdate,
      loyalPregdate: !!globalData.pregdate,
      pregdateRangeEnd: parseInt(today.split('-')[0]) + 1 + '-' + today.split('-')[1] + '-' + today.split('-')[2],
      pregdateRangeStart: parseInt(today.split('-')[0]) - 10 + '-' + today.split('-')[1] + '-' + today.split('-')[2]
    })
    // 获取storage值
    wx.getStorage({
      key: 'lastData',
      success: function (res) {
        if (!res.data.pregdate.match('请选择')) {
          pregdate = res.data.pregdate
        }
        that.setData({
          pregdate: res.data.pregdate,
          surname: res.data.surname,
          sex: res.data.sex,
          word: res.data.word,
          name: res.data.name,
          loyalSur: true,
          loyalName: !!res.data.name,
          loyalPregdate: true
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  // 切换tab
  changeTab: function (e) {
    var targetCal = e.currentTarget.dataset.cal
    if (typeof targetCal !== 'undefined') {
      targetCal = JSON.parse(targetCal)
    }
    this.setData({
      isTest: targetCal
    })
  },
  // 监听姓氏输入
  bindSunameChange: function (e) {
    this.setData({
      surname: e.detail.value,
      loyalSur: this.verify(e.detail.value)
    })
  },
  // 监听名字输入
  bindNameChange: function (e) {
    this.setData({
      name: e.detail.value,
      loyalName: this.verify(e.detail.value)
    })
  },
  // 校验是否合法
  verify: function (value) {
    var i = /[0-9]+/
    var str = /[A-Za-z]/
    var spec = /[,.<>{}~!@#$%^&*]/
    var result = !!(value && value.split('').length <= 3 && !i.test(value) && !str.test(value) && !spec.test(value))
    return result
  },
  // 监听喜欢的字
  bindWordChange: function (e) {
    this.setData({
      word: e.detail.value
    })
  },
  // 监听性别选择器
  bindSexChange: function (e) {
    this.setData({
      sex: e.detail.value
    })
  },
  // 监听预产期
  bindpregdateChange: function (e) {
    this.setData({
      pregdate: e.detail.value,
      loyalPregdate: true
    })
  },
  // 申请起名/测名
  gotoApply: function () {
    let data = this.data
    wx.setStorage({
      key: 'lastData',
      data: data
    })
    wx.navigateTo({
      url: '../name/detail?surname=' + data.surname + '&name=' + data.name + '&word=' + data.word + '&sex=' + data.sex + '&pregdate=' + data.pregdate + '&isTest=' + data.isTest
    })
  },
  // 错误提示
  showToast: function (hint) {
    wx.showToast({
      title: hint,
      image: '../../image/wrong.png',
      duration: 1000
    })
  },
  // 申请前校验
  apply: function () {
    var hint = ''
    var surname = this.data.surname
    var word = this.data.word
    var name = this.data.name
    var i = /[0-9]+/
    var str = /[A-Za-z]/
    var spec = /[,.<>{}~!@#$%^&*]/
    if (this.data.isTest) {
      if (!surname) {
        hint = '姓氏是必填项哦'
        this.showToast(hint)
      } else if (surname.split('').length > 3) {
        hint = '姓氏不能超过三个字哦'
        this.showToast(hint)
      } else if (i.test(surname) || str.test(surname) || spec.test(surname) || i.test(name) || str.test(name) || spec.test(name)) {
        hint = '不能包含英文、数字或特殊字符哦~'
        this.showToast(hint)
      } else if (!name) {
        hint = '名字是必填项哦'
        this.showToast(hint)
      } else if (name.split('').length > 3) {
        hint = '名字不能超过三个字哦'
        this.showToast(hint)
      } else if (this.data.pregdate.match('请选择')) {
        hint = '请选择预产期~'
      } else {
        this.gotoApply()
      }
    } else {
      if (!surname) {
        hint = '姓氏是必填项哦'
        this.showToast(hint)
      } else if (surname.split('').length > 3) {
        hint = '姓氏不能超过三个字哦'
        this.showToast(hint)
      } else if (i.test(surname) || str.test(surname) || spec.test(surname) || i.test(word) || str.test(word) || spec.test(word)) {
        hint = '不能包含英文、数字或特殊字符哦~'
        this.showToast(hint)
      } else if (word.split('').length > 1) {
        hint = '喜欢的字只能有一个哦'
        this.showToast(hint)
      } else if (this.data.pregdate.match('请选择')) {
        hint = '请选择预产期~'
        this.showToast(hint)
      } else {
        this.gotoApply()
      }
    }
  }
})
