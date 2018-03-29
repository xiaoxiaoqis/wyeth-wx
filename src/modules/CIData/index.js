


const config = require('../../config')

var cidata = require("cidata-sdk");
cidata.init(config.cidata_appkey)

var CIData = {
  setUserId: function (id) {
    console.log('CIData: setUserId %s', id)
    cidata.setUserId(id)
  },
  setChannel: function (channel) {
    console.log('CIData: setChannel %s', channel)
    cidata.setChannel(channel)
  },
  setUserProperties: function (user_properties) {
    console.log('CIData: setUserProperties %s', JSON.stringify(user_properties))
    cidata.setUserProperties(user_properties)
  },
  // 自定义事件
  sendEvent: function (category, params) {
    console.log('CIData: sendEvent %s %s', category, JSON.stringify(params))
    cidata.sendEvent(category, params)
  },
  // 课程曝光
  recActionExpose: function (obj) {
    console.log('CIData: recActionExpose %s', obj.id)
    if (obj && obj.id) {
      cidata.recActionExpose(obj.id)
    }
  },
  // 课程曝光（多节课）
  recActionExpose_array: function (array) {
    if(array && typeof(array) === "object"){
      array.forEach(element => {
        this.recActionExpose(element);
      });
    }
  },
  // 课程浏览
  recActionView: function (obj) {
    console.log('CIData: recActionView %s', obj.id)
    if (obj && obj.id) {
      cidata.recActionView(obj.id)
    }
  },
  // 转化成功    （听课）
  recActionTransact: function (obj) {
    console.log('CIData: recActionTransact %s', obj.id)

    if (obj && obj.id) {
      cidata.recActionTransact(obj.id)
    }
  },
  // 收藏物品    （收藏）
  recActionCollect: function (obj) {
    console.log('CIData: recActionCollect %s', obj.id)

    if (obj && obj.id) {
      cidata.recActionCollect(obj.id)
    }
  },
  // 取消收藏
  recActionUncollect: function (obj) {
    console.log('CIData: recActionUncollect %s', obj.id)

    if (obj && obj.id) {
      cidata.recActionUncollect(obj.id)
    }
  },
  // 喜欢/点赞
  recActionLike: function (obj) {
    console.log('CIData: recActionLike %s', obj.id)

    if (obj && obj.id) {
      cidata.recActionLike(obj.id)
    }
  },
  // 不喜欢/取消点赞
  recActionDislike: function (obj) {
    console.log('CIData: recActionDislike %s', obj.id)

    if (obj && obj.id) {
      cidata.recActionDislike(obj.id)
    }
  }
}

module.exports = CIData


