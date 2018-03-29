<template>
  <div v-show = "recommendList.length > 0" id = "courseRecommend">
    <panel :title = "title" :paddingLeft = "12" :paddingRight = "34"
           :titlePaddingLeft = "10" :extraPaddingRight = "27" :titleSize = "29"
           :extraSize = "25" :imgBg = "'http://wyeth-course.nibaguai.com/wyeth/image/header_bg.png'"
           :imgLeftWitdh = "8" titleColor = "#af730c" extraColor = "#666666"
           :imgLeftHeight = "38" :imgRightWitdh = "28" :imgRightHeight = "28"
           :noextra="true"
           @more = "moreClick" :imgLeft = "require('/assets/line.png')"></panel>
    <OHSClassList :items="recommendList" @onItemClick="onItemClick"></OHSClassList>

  </div>
</template>

<script>
import panel from '../../components/panel'
import OHSClassList from '../../components-proj/all/classList/ohs-classlist.vue'
import { courseRoute } from '../../modules/tools'

export default {
  components: {
    panel: panel.weexComponent,
    OHSClassList: OHSClassList
  },
  props: {
    title: {
      type: String,
      required: false,
      default: '爱学习的妈妈都在看'
    },
    recommendList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {}
  },
  methods: {
    moreClick: function () {
      this.$router.push({name:'all'})
    },
    onItemClick: function (item) {
      console.log('courseRecommend:', item)
      courseRoute(item)
    }
  }
}
</script>
