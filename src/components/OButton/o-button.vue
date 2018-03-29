<template>
    <div class = "o-button" a = "1" :style = "wrapStyle" >
      <div class = "o-button-inner" :style = "innerStyle">
        <text :style = "textStyle"
              :lines = "1">{{text}}</text>
        <text :style ="{ color:fc} "></text>
      </div>
    </div>

</template>

<script>
  // 其它用法与vue相同
  import Base from '../../mixins/base'
  export default {
    mixins: [Base],
    components: {
    },
    props: {
      text: {
        type: String,
        required: true
      },
      width: {
        type: Number,
        default: function () {
          return 0
        }
      },
      height: {
        type: Number,
        default: function () {
          return 0
        }
      },
      radius: {
        type: Number,
        default: function () {
          return 0
        }
      },
      backgroundColor: {
        type: String,
        default: function () {
          return '#ffffff'
        }
      },
      fontSize: {
        type: Number,
        default: function () {
          return 26
        }
      },
      borderWidth: {
        type: Number,
        default: function () {
          return 3
        }
      },
      activeBorderColor: {
        type: String,
        default: function () {
          return '#b37624'
        }
      },
      defaultBorderColor: {
        type: String,
        default: function () {
          return '#d4d9e7'
        }
      },
      activeTextColor: {
        type: String,
        default: function () {
          return '#b37624'
        }
      },
      defaultTextColor: {
        type: String,
        default: function () {
          return '#666666'
        }
      },
      highLight: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      gradientDirection: {
        type: String,
        default: function () {
          return 'to right'
        }
      },
      gradientColors: {
        type: Array,
        default: function () {
          return ['#DEC050', '#9F660D', '#EDCB73', '#9F660D', '#DEC050']
        }
      }
    },
    data () {
      return {
//      inLight: this.highLight,
        fc:'blue'
      }
    },
    computed: {
      inLight () {
        return this.highLight
      },
      padding: function () {
        return this.borderWidth
//      return this.inLight?this.borderWidth:2
      },
      wrapStyle: function () {
//      background-image:
//      linear-gradient(to right,#DEC050,#9F660D,#EDCB73,#9F660D,#DEC050);
        if (this.gradientColors.length > 0) {
          var lg = 'linear-gradient(' + this.gradientDirection + ',' + this.gradientColors.join(',') + ')'
        }
        return {
          width: this.width === 0 ? 'auto' : this.rpx(this.width, true),
          height: this.height === 0 ? 'auto' : this.rpx(this.height, true),
          borderRadius: this.rpx(this.radius, true),

          backgroundColor: this.inLight ? this.activeBorderColor : this.defaultBorderColor,
          backgroundImage: this.inLight ? lg : 'none'
        }
      },
      innerStyle: function () {
        return {
          backgroundColor: this.backgroundColor,
          margin: Math.ceil(this.rpx(this.padding)) + 'px',
          borderRadius: this.rpx((this.radius), true)
        }
      },
      textStyle: function () {
        return {
          color: this.inLight ? this.activeTextColor : this.defaultTextColor,
          fontSize: this.rpx(this.fontSize, true)
        }
      }
    },
    methods: {
//    enable:function () {
//      this.inLight = true
//    },
//    disable:function () {
//      this.inLight = false
//    }
    }
  }
</script>

<style lang = "sass" scoped>
  @import "./index.scss"
</style>
