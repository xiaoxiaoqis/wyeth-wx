<template>
  <div class = "o-text-info-cell-container" :style = "cellStyle">

    <text :style = "keyStyle">{{keyText}}</text>
    <text :style = "valueStyle">{{valueText}}</text>

  </div>
</template>

<script>
  import base from '../../mixins/base'
  module.exports = {
    mixins: [base],
    props: {
      height: {
        type: Number,
        default: function () {
          return -1
        }
      },
      width: {
        type: Number,
        default: function () {
          return -1
        }
      },
      left: {
        type: Number,
        default: function () {
          return 38
        }
      },
      right: {
        type: Number,
        default: function () {
          return 38
        }
      },
      keyText: {
        type: String,
        required: true
      },
      keyColor: {
        type: String,
        default: function () {
          return '#333333'
        }
      },
      keySize: {
        type: Number,
        default: function () {
          return 30
        }
      },
      valueText: {
        type: String,
        required: true
      },
      valueColor: {
        type: String,
        default: function () {
          return '#333333'
        }
      },
      valueSize: {
        type: Number,
        default: function () {
          return 30
        }
      }
    },
    data () {
      return {}
    },
    computed: {
      cellStyle () {
        return {
          height: this.height === -1 ? 'auto' : this.rpx(this.height, true),
          width: this.width === -1 ? 'auto' : this.rpx(this.width, true),
          marginLeft: this.rpx(this.left, true),
          marginRight: this.rpx(this.right, true)
        }
      },
      keyStyle () {
        return {
          fontSize: this.rpx(this.keySize, true),
          color: this.keyColor
        }
      },
      valueStyle () {
        return {
          fontSize: this.rpx(this.valueSize, true),
          color: this.valueColor
        }
      }
    },
    methods: {}
  }
</script>

<style lang = "sass" scoped>
  @import "index"
</style>
