<template>
  <div class = "o-slider-container">
    <slider :style = "sliderStyle"
            @change = "onChange"
            :interval = "interval"
            :auto-play = "autoPlay">
      <div class = "frameStyle"
           v-for = "(item,index) in items">
        <image :style = "imageStyle" resize = "cover" :src = "item.img" @click = "itemclick(item)"/>
      </div>
    </slider>
    <div v-show = "showIndicator" class = "o-slider-indicator-wrap">
      <OIndicator
        :num = "items.length"
        :current = "index"
        :height = "31"
        :potWidth = "20"
        :potHeight = "24"
        :imgSelected = "require('/assets/pot_selected.png')"
        :imgDefault = "require('/assets/pot_default.png')"></OIndicator>
    </div>

  </div>
</template>


<script>
// 其它用法与vue相同
import Base from '../../mixins/base'
import OIndicator from '../../components/indicator'
export default {

  mixins: [Base],
  components: {
    OIndicator: OIndicator.weexComponent
  },
  props: {
    hrefs: Array,
    items: {
      type: Array,
      required: true
    },
    showIndicator: {
      type: Boolean,
      default: function () {
        return true
      }
    },
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    autoPlay: {
      type: Boolean,
      default: function () {
        return true
      }
    },
    interval: {
      type: Number,
      default: function () {
        return 1500
      }
    }
  },
  created () {
    console.log('hrefs', this.hrefs)
  },
  computed: {
    sliderStyle () {
      return {
        width: this.rpx(this.width, true),
        height: this.rpx(this.height, true)
      }
    },
    frameStyle () {
      return {
        width: this.rpx(this.width, true),
        height: this.rpx(this.height, true)
      }
    },
    imageStyle () {
      return {
        width: this.rpx(this.width, true),
        height: this.rpx(this.height, true)
      }
    }
  },
  data () {
    return {
      index: 1
    }
  },
  methods: {
    onChange (event) {
      switch (this.getPlatform()) {
        case 'WX_APP':
          this.index = event.detail.current
          break
        case 'BROWSER':
          this.index = event.index + 1
          break
      }
    },
    itemclick: function (item) {
      console.log('itemclick ')
      this.$emit('itemclick', item)
    }
  }
}
</script>

<style lang = "sass" scoped>
  @import "index"
</style>
