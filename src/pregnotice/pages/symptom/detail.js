let api = require('../../util/api.js')
let app = getApp()
let like = require('../../components/likeAndShare/index.js')
Page({
  data: {
    caseinfo: null,
    examples: null,
    likeShare: {},
    curTab: 0,
    id: null
  },
  onLoad: function (options) {
    this.setData({
      id: options.id || 1
    })
    this.updateData()
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onShareAppMessage () {
    return {
      title: `${this.data.caseinfo.name}怎么办？ - 孕期症状百科`,
      content: `${this.data.caseinfo.description}，专家解读：${this.data.examples[0].answer.join()}`,
      url: `../symptom/index?sharedBy=${app.globalData.userInfo.userId || 0}`
    }
  },
  doLike: function () {
    let that = this
    like.postLike({
      data: { type: 2, id: that.data.id},
      that
    })
  },
  updateData: function () {
    // 请求「发现」数据
    var that = this
    api.fetchData({
      url: 'case/' + that.data.id,
      data: {},
      that,
      success: function (data) {
        console.log(data)
        let likeShare = {
          isLove: data.case.is_love !== '0',
          count: parseInt(data.case.loves)
        }
        that.setData({
          caseinfo: data.case,
          examples: data.example,
          likeShare
        })
      }
    })
  },
  changeExample: function (e) {
    let tabIndex = parseInt(e.currentTarget.dataset.index)
    this.setData({
      curTab: tabIndex
    })
  }
})
