/*
userInfo
{
  "ret": 1,
  "data": {
    "id": 5291205,
    "openid": "owtN6jubVF1cg7gRnKFnMrGN8rW0",
    "nickname": "L",
    "avatar": "http:\/\/wx.qlogo.cn\/mmopen\/QIJaoeWuXhF1qpy08tibUvo089E9PMTqWOQLqk8KlVV0LAs6SAbo2yUOz5Z17rMYyBqWTIWr6YNW8B9r6Qak4Dynj5jsdtJHU\/0",
    "channel": "wxmenudbb_sy",
    "user_properties": {
      "edc": 1496246400
    },
    "user_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX3R5cGUiOiJ1c2VyIiwidWlkIjo1MjkxMjA1LCJuaWNrbmFtZSI6IkwiLCJpc3MiOiJodHRwOlwvXC9tYW1hLXdlaWtldGFuZy5lLXNob3B3eWV0aC5jb21cL21vYmlsZVwvaW5kZXgiLCJpYXQiOjE1MDI3NzY0MzAsImV4cCI6MTUwMzM4MTIzMCwibmJmIjoxNTAyNzc2NDMwLCJqdGkiOiI4ZDAwMDE2ZDIwZThjZDVjNTVlMTA2ODRlZDRmOGYxZSJ9.V-nyZF_NXJzfMyJ42v4BVKrMNgu2K_UEXn7KTqN0xCQ",
    "chooseTag": false,
    "is_sign": true
  }
} */

// import CIData from '../CIData'
import event from '../event'
import network from '../network/network'
import data from '../../data'
import { WxShare } from '../WxSDK/index'
import config from '../../config.json'

import store from '../store/index'

import API from '../../lib/api'

export function beforeLoad() {
  if (!data.store('userInfo')) {
    network.getLoginInfo(function (res) {
      if (res.ret !== 1) {
        return
      }

      let userInfo = res.data

      console.log('userInfo: ', userInfo)

      window.CIData.push(['setUserId', userInfo.id])
      window.CIData.push(['setChannel', userInfo.channel])
      window.CIData.push(['setUserProperties', userInfo.user_properties])

      data.store('userInfo', userInfo)

      let MqPot = { showRedPot: !userInfo.is_sign }

      store.getItem('MqPot', function (res) {
        if (res.result === 'success') {
          console.log('---- res ----', res)
          let data = JSON.parse(res.data)
          if (data.showRedPot) {
            MqPot.showRedPot = true
          }
        }
      })

      console.log('userInfo.is_sign', userInfo.is_sign)

      console.log('----- MqPot -----', MqPot)
      store.setItem('MqPot', JSON.stringify(MqPot), function () {

      })

      let title = '魔栗妈咪学院'
      let desc = '最权威专家为您答疑解惑，学育儿知识还能赚取积分MQ，兑换惠员好礼哦！当妈妈不仅要有EQ、IQ，还要有MQ哦！~~~'
      let img = 'http://wyeth-course.nibaguai.com/wyeth/image/logo.png'
      let link = config.host + '/mobile/index?'
      WxShare.share(title, desc, img, link, function () {
        console.log('分享成功')
      }, function () {
        console.log('分享失败')
      })

      if (!userInfo.chooseTag) {
        window.stashPath = '/follow'
      }

      if (!userInfo.crm_status || userInfo.crm_status === 0) {
        window.needReg = true
      }

      if (!userInfo.is_sign) {
        event.sendEvent('signup')
      }
    })
  }
}


module.exports = {
  checkRegister: function () {

    let userInfo = getApp().globalData.userInfo

    if (!userInfo.crm_status || userInfo.crm_status === 0) {
      wx.navigateToMiniProgram({
        appId: 'wxeb490c6f9b154ef9', // 固定为此appid，不可改动   
        extraData: {
          encrypt_card_id: "CzYZhj3KbxPkJPrH03REqSDAGTGowKg22ARjgL6Z9dO4lWgd7wsN11p19q1JJGGg",
          outer_str: "wyeth_mini",
          biz: "MjM5MDQxNDI3NA=="
        },
        success: function (res) {
          console.log('开卡成功：', res)
        },
        fail: function (error) {
          console.log('开卡失败：', error)
        },
        complete: function () { }
      })

      return true
    } else if(userInfo.crm_status === 2){
      // 填写注册信息
      API.push({ url: "/pages/other/register" });
      return true
    }else{
      return false
    }
  }
}

