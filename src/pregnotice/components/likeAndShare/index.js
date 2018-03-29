let api = require('../../util/api.js')
let app = getApp()
let globalData = app.globalData
/**
 * 用户点赞
 * @param  {Object} data 必选，query参数，不可为空
 * @param  {Object} that 必选，Page实例，一般是页面的this对象
 */
let params = {
  user_id: globalData.userInfo ? globalData.userInfo.userId : 0,
  plat: 0
}
function postLike ({
  data,
  that
}) {
  api.postData({
    url: 'home/love',
    data: Object.assign(params, data),
    that,
    success: function (data) {
      let like = that.data.likeShare
      let likeShare = {
        isLove: !like.isLove,
        count: !like.isLove ? like.count + 1 : like.count - 1
      }
      that.setData({
        likeShare
      })
    },
    fail: function () {
      console.log('fail post')
    }
  })
}
module.exports = {
  postLike
}
