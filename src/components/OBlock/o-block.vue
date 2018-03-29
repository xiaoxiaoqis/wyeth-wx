<template>
  <div :style = "blockStyle">
  </div>
</template>

<script>
  // 其它用法与vue相同
  import Base from '../../mixins/base'
  export default {
    mixins: [Base],
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
      margin: {
        type: Number,
        default: function () {
          return 0
        }
      },
      marginLeft: {
        type: Number,
        default: function () {
          return 0
        }
      },
      marginRight: {
        type: Number,
        default: function () {
          return 0
        }
      },

      marginTop: {
        type: Number,
        default: function () {
          return 0
        }
      },
      marginBottom: {
        type: Number,
        default: function () {
          return 0
        }
      },
      bgColor: {
        type: String,
        default: function () {
          return '#dddddd'
        }
      }
    },
    data () {
      return {

      }
    },
    computed: {
      blockStyle () {
        return {
          width: this.width >= 0 ? this.rpx(this.width, true) : 'auto',
          height: this.height >= 0 ? this.rpx(this.height, true) : 'auto',
          margin: this.rpx(this.margin, true),
          marginLeft: this.rpx(this.marginLeft, true),
          marginRight: this.rpx(this.marginRight, true),
          marginTop: this.rpx(this.marginTop, true),
          marginBottom: this.rpx(this.marginBottom, true),
          backgroundColor: this.bgColor
        }
      }
    },
    methods: {}
  }
</script>

<style lang = "sass" scoped>
  @import "./index.scss"
</style>
