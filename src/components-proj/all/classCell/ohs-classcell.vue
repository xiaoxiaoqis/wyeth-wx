<template>
  <div style = "flex-direction: column;align-items: stretch;background-color: white">
    <div class = "ohs-classcell-container">
      <div class = "ohs-classcell-cover-group">
        <image class = "ohs-classcell-cover-img"
               :src = "obj.img"/>
        <image class = "ohs-classcell-cover-vedio" v-show = "isVideo"  :src = "require('/assets/video.png')"/>
      </div>
      <div class = "ohs-classcell-txt-group">
        <text class = "ohs-classcell-title" :lines = "1">{{obj.title}}</text>
        <div class = "ohs-classcell-techer-layout">
          <image class = "ohs-classcell-usericon" :src = "require('/assets/icon.png')"/>
          <text class = "ohs-classcell-name" :lines = "1">{{obj.teacher_name}}</text>
          <text class = "ohs-classcell-hospital" :lines = "1">{{obj.teacher_hospital}}</text>
        </div>
        <div class = "ohs-classcell-time-layout"  v-show = "!isOutdate">
          <image class = "ohs-classcell-time-img" :src = "require('/assets/clock.png')"/>
          <text class = "ohs-classcell-time" :lines = "1">{{obj.start_day+' '+obj.start_time}}</text>
        </div>
        <div class = "ohs-classcell-extra-wrap" v-show = "isOutdate">
          <image class = "ohs-classcell-tag-img" :src = "require('/assets/tag.png')"/>
          <text class = "ohs-classcell-extra"  v-if = "obj.tag" :lines = "1">{{obj.tag}}</text>
        </div>
        <div class = "ohs-classcell-extra-layout">
          <div class = "ohs-classcell-hot-wrap">
            <image class = "ohs-classcell-hot-img" :src = "require('/assets/hot.png')"/>
            <text class = "ohs-classcell-hot" :lines = "1">{{num2str(obj.hot)}}</text>
          </div>
          <div class = "ohs-classcell-extra-wrap" v-show = "!isOutdate">
            <image class = "ohs-classcell-tag-img" :src = "require('/assets/tag.png')"/>
            <text class = "ohs-classcell-extra" v-if = "obj.tag" :lines = "1">{{obj.tag}}</text>
          </div>
        </div>
      </div>
    </div>
    <OBlock a = "1" :marginLeft = "20" :height = "1" bgColor = "#eeeeee"></OBlock>
  </div>

</template>

<script>
  // 其它用法与vue相同
  import OBlock from '../../../components/OBlock'

  export default {
    components: {
      OBlock: OBlock.weexComponent
    },
    props: {
      obj: {
        type: Object,
        required: true
      }
    },
    data () {
      return {}
    },
    computed: {
//      compressImg: function () {
//        let img = this.obj.img.indexOf('imageView') > 0 ? this.obj.img : this.obj.img + '?imageView2/1/w/234/h/200'
//        return img
//      },
      isVideo: function () {
        if (!this.obj.review_type) {
          return false
        }
        switch (this.obj.review_type) {
          case 0:
            return false
          case 1:
            return false
          case 2:
            return true
          default:
            return false
        }
      },
      isOutdate: function () {
        if (!this.obj.start_day) {
          return true
        }
        var t = this.obj.start_day + ' ' + this.obj.start_time

        let reg = new RegExp('[-: /]', 'g')
        let arr = t.split(reg)
        arr[1] = arr[1] - 1
        let time = new Date(...arr)
        var now = Date.parse(new Date())
        if (now < time) {
          return false
        } else {
          return true
        }
      }
    },
    created () {

    },
    methods: {}
  }
</script>

<style lang="sass" scoped>
  @import "./index.scss"
</style>
