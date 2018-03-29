<template>
  <div :style = "shadowStyle"></div>
</template>

<script>
// 其它用法与vue相同
import Base from '../../mixins/base'
export default {
  mixins:[Base],
  props: {
    width: {
      type: Number,
      default: function () {
        return -1
      }
    },
    height: {
      type: Number,
      default: function () {
        return -1
      }
    },
    direction: {
      type: String,
      default: function () {
        return 'to bottom'
      }
    },
    startAlpha: {
      type: Number,
      default: function () {
        return 0.1
      }
    },
    endAlpha: {
      type: Number,
      default: function () {
        return 0
      }
    }

  },
  data () {
    return {

    }
  },
  computed: {
    shadowStyle () {
      return {
        width: this.width === -1 ? 'auto' : this.rpx(this.width, true),
        height: this.height === -1 ? 'auto' : this.rpx(this.height, true),
        backgroundImage: 'linear-gradient(' + this.direction + ',RGBA(0,0,0,' + this.startAlpha +
        '),RGBA(255,255,255,' + this.endAlpha + '))'
      }
    }
  },
  methods: {}
}
</script>

<style lang = "sass" scoped>
  @import "./index.scss"
</style>
