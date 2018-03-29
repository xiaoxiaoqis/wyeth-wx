// 每个组件以这种形式对外暴露
import { register } from 'utils'

var components = {
    // 公用
  OtherClass: require('./otherClass.vue'),
  CourseRecommend: require('./courseRecommend.vue'),
  CourseAd: require('./courseAd.vue'),
  LikeButton: require('./likeButton.vue'),
  CollectButton: require('./collectButton.vue'),
  ClassHeaderPrice:require('./classHeaderPrice.vue'),

    // Audio
  Introduction: require('./introduction.vue'),
  Classlist: require('./classlist.vue'),
  AudioBottom: require('./audioBottom.vue'),
    // Video
  VideoPlayer: require('./videoPlayer.vue'),
  ClassHeader: require('./classHeader.vue')
}

Object.keys(components).map(function (key) {
  components[key] = register(components[key])
  return components
})

module.exports = components
