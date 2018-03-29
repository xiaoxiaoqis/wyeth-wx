import CIData from '../CIData'

export function courseRoute(item, params) {
  // let router = window.vm.$router
  let router
  if (window) {
    router = window.vm.$router
  } else {
    router = getApp().$app.$router
  }

  let toName = ''
  switch (item.status) {
    case 1:
      // 报名中
      toName = 'courseNew'
      break
    case 3:
      // 已结束
      switch (item.review_type) {
        case 0:
          // 未上传
          toName = 'courseNew'
          break
        case 1:
          // 音频
          toName = 'courseAudio'
          break
        case 2:
          // 视频
          toName = 'courseVideo'
          break
        default:
          break
      }
      break
    case 4:
      // 已报名
      toName = 'courseNew'
      break
    default:
      break
  }
  if (toName && toName.length > 0) {
    let currentName = router.currentRoute ? router.currentRoute.name : ''

    CIData.recActionView(item)
    
    if (params) {
      params.id = item.id
      if (currentName === 'courseAudio' || currentName === 'courseVideo' || currentName === 'courseNew' || currentName === 'shareResult') {
        router.replace({ name: toName, params: params })
      } else {
        router.push({ name: toName, params: params })
      }
    } else {
      if (currentName === 'courseAudio' || currentName === 'courseVideo' || currentName === 'courseNew' || currentName === 'shareResult') {
        router.replace({name: toName, params:{id:item.id}})
      } else {
        router.push({name: toName, params:{id:item.id}})
      }
    }
  }
}

export function changeNum(num) {
  let n = parseInt(num)
  if (n >= 10000) {
    return (n / 10000).toFixed(2) + '万'
  } else {
    return n
  }
}

export function timeFormit(seconds) {
  seconds = parseFloat(seconds)
  if (!seconds || seconds <= 0) {
    return '00:00'
  }
  seconds = parseInt(seconds)

  function add0(m) {
    return m === 0 ? '00' : (m < 10 ? '0' + m : m)
  }
  return add0(parseInt(seconds / 60)) + ':' + add0(seconds % 60)
}
