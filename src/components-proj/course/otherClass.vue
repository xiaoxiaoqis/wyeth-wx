<template>
  <div  class = "o-cells-container">
    <panel :title = "title" :paddingLeft = "12" :paddingRight = "34" :titlePaddingLeft = "10" :extraPaddingRight = "27" :titleSize = "29" :extraSize = "25" :imgBg = "'http://wyeth-course.nibaguai.com/wyeth/image/header_bg.png'" :imgLeftWitdh = "8" titleColor = "#af730c" extraColor = "#666666" :imgLeftHeight = "38" :imgRightWitdh = "28" :imgRightHeight = "28" @more = "moreClick" :imgLeft = "require('/assets/line.png')"></panel>
    <div class = "o-cells-container-main">
      <div class = "o-cells-container-item" v-for = "item in items" @click = "onItemclick(item)">
        <div>
          <div class = "o-cells-cover">
            <image class = "o-cells-cover-img" :src = "item.img"/>
            <div class = "o-cells-cover-mask" style = "background-image:linear-gradient(to top,RGBA(48,48,48,0.5),RGBA(255,255,255,0));"></div>
            <image class = "o-cells-cover-num-icon" :src = "require('/assets/love.png')"/>
            <text class = "o-cells-cover-num" :lines = "1">{{item.hot}}</text>
          </div>
          <text class = "o-cells-title" :lines = "2">{{item.title}}</text>
        </div>
        <div>
          <div class = "o-cells-name-desc">
            <text class = "o-cells-name" :lines = "1">{{item.teacher_name}}</text>
            <text class = "o-cells-desc" :lines = "1">{{item.teacher_position}}</text>
          </div>
          <div class = "o-cells-class-tag">
            <image class = "o-cells-tag-img" :src = "require('/assets/tag.png')"/>
            <text class = "o-cells-tag-txt" v-show = "item.tag" :lines = "1">{{item.tag}}</text>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import panel from '../../components/panel'

import { courseRoute } from '../../modules/tools'

// 其它用法与vue相同
export default {
  components: {
    panel: panel.weexComponent
  },
  props: {
    title: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      imgHeader: require('/assets/header_bg.png'),
      titleTxt: this.title
    }
  },
  computed: {
    nums() {

    }
  },
  methods: {
    onItemclick: function (item) {
      courseRoute(item)
    },
    moreClick: function () {
      this.$router.push('/all')
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "otherClass"
</style>
