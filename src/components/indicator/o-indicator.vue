<template>
  <div class = "o-indicator-container" :style = "containerStyle">
    <image class = "o-indicator-pot" :style = "potStyle" v-for = "i in num"
           :src = "i === current?imgSelected:imgDefault">
    </image>
  </div>
</template>

<script>
// 其它用法与vue相同
import Base from '../../mixins/base'
export default {
  mixins: [Base],
  props: {
    num: {
      type: Number,
      required: true
    },
    imgDefault: {
      type: String,
      required: true
    },
    imgSelected: {
      type: String,
      required: true
    },
    current: {
      type: Number,
      required: true
    },
    potWidth: {
      type: Number,
      default: function () {
        return 20
      }
    },
    potHeight: {
      type: Number,
      default: function () {
        return 20
      }
    },
    space: {
      type: Number,
      default: function () {
        return 52
      }
    },
    height: {
      type: Number,
      default: function () {
        return -1
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {
    potStyle () {
      return {
        width: this.rpx(this.potWidth, true),
        height: this.rpx(this.potHeight, true)
      }
    },
    containerStyle () {
      return {
        width: this.rpx(this.potWidth * this.num + this.space * (this.num - 1), true),
        height: this.height >= 0 ? this.rpx(this.height, true) : 'auto'
      }
    }
  },
  methods: {}
}
</script>

<style lang = "sass" scoped>
  @import "./index.scss"
</style>
