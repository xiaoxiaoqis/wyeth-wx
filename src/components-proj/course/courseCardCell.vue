<template>
  <div class="courseCardCell">
    <div class="courseCardCell-poster">
      <image class="courseCardCell-img" :src="item.img.indexOf('imageView')>0?item.img:item.img+'?imageView2/1/w/340/h/340'"/>
      <div class="courseCardCell-mask" style="background-image:linear-gradient(to top,RGBA(38,38,38,0.5),RGBA(255,255,255,0));">
        <image class="courseCardCell-num-icon" :src="require('assets/love.png')"/>
        <text class="courseCardCell-num" :lines="1">{{num2str(item.hot)}}</text>
      </div>
    </div>
    <div class="courseCardCell-content">
      <text class="courseCardCell-content-title" :lines="2">{{item.title}}</text>
      <div class="courseCardCell-content-userInfo">
        <image class="userInfo-avatar" :src="item.teacher_avatar"/>
        <div class="userInfo-text">
          <text class="userInfo-name" :lines="1">{{item.teacher_name}}</text>
          <text class="userInfo-hospital" :lines="1">{{item.teacher_hospital}}</text>
          <text class="userInfo-position" :lines="1">{{item.teacher_position}}</text>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 其它用法与vue相同

export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
  },
  created() {

  },
  methods: {}
}
</script>

<style lang = "sass" scoped>
  @import "./courseCardCell.scss"
</style>
