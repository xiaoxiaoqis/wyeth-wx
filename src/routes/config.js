// 依赖模块

// 一级页面

const routes = [

  {
    name: 'all',
    path: '/all',
    url: '/pages/index',
    meta: {
      keepAlive: true // 需要被缓存
    }
  },
  {
    name: 'courseAudio',
    path: '/courseAudio/:id',
    url: '/pages/course/courseAudio',
    meta: {
      graySkin: true // 显示灰皮
    }
  },
  {
    name: 'courseVideo',
    path: '/courseVideo/:id',
    url: '/pages/course/courseVideo',
    meta: {
      graySkin: true // 显示灰皮
    }
  },
  {
    name: 'courseNew',
    path: '/courseNew/:id',
    url: '/pages/course/courseNew',
    meta: {
      graySkin: true // 显示灰皮
    }
  },
  {
    name: 'courseSeries',
    path: '/courseSeries/:id',
    url: '/pages/course/courseSeries'
  },
  {
    name: 'search',
    path: '/search',
    url: '/pages/search/search'
  },
  {
    name: 'questionDetail',
    path: '/questionDetail',
    url: '/pages/search/questionDetail'
  },
  {
    name: 'orderPay',
    url: '/pages/other/orderPay'
  },
  {
    name: 'recharge',
    url: '/pages/other/recharge'
  },
  {
    name: 'register',
    url: '/pages/other/register'
  }
]

export default {
  routes: routes,
  success: function (pre, next,params) {
    
    let url = next.url
    if(params){
      url += '?'
    }
    Object.keys(params).map(function (key) {
      url = url + key + '=' + params[key] + '&'
    })

    let CIData = require('../modules/CIData/index')
    CIData.sendEvent('trackPageView', {url:url})

  },
  fail: function () {
    console.log('### config,fail')
  },
  complete: function () {
    console.log('### config,complete')
  }
}
