let api = require('../../util/api.js')
let app = getApp()
Page({
  data: {
    checkUpList: {},
    curCheckUpIndex: 0,
    processingChekUpId: 0
  },
  onLoad: function (options) {
    this.updateData()
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  updateData: function () {
    // 请求「发现」数据
    let that = this
    api.fetchData({
      url: 'preg/check/list',
      data: {},
      that,
      success (res) {
        let data = res.check
        let curCheckUpIndex, processingChekUpId
        for (let i = 0; i < data.length; i++) {
          let date = data[i].date
          let newDate = [(new Date(date).getMonth() + 1) + '月' + new Date(date).getDate() + '日', new Date(date).getFullYear() + '年']
          data[i]['dateF'] = newDate
          if (data[i].is_selected) {
            curCheckUpIndex = i
            processingChekUpId = data[i].id
          }
        }
        that.setData({
          checkUpList: data,
          // curCheckUpIndex,
          processingChekUpId
        })
        setTimeout(() => {
          that.setData({
            curCheckUpIndex
          })
        }, 500)
      }
    })
  }
})
