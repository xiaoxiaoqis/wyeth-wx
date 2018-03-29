<template>
  <scroller scroll-direction = "horizontal">
    <div class = "o-tagSelect-container">
      <div v-for = "(item,key) in tags" :key="key" @click = "onClick(key)" :data-x="key" :style =
        "{justifyContent: 'center'}">
        <!--<OButton :text = "item"-->
        <!--:radius = "31" :height='62'-->
        <!--:ref = "'btn'+key"-->
        <!--:borderWidth = "1"-->
        <!--:highLight = "key === index"-->

        <!--&gt;</OButton>-->

        <div class = "o-button" :style = "{width:width===0?'auto':width+'px',
      height:height===0?'auto':height+'px',
      borderRadius: radius+'px',
      backgroundColor: key === index ? activeBorderColor : defaultBorderColor,
      backgroundImage: key === index ? linearGradient : 'none',
      marginLeft:'6px',
      marginRight:'6px'}" >
          <div class = "o-button-inner" :style = "innerStyle">
            <text :style = "{
        	  color: key === index ? activeTextColor : defaultTextColor,
            fontSize: fontSize+'px',
            overflow: 'hidden',textOverflow: 'ellipsis',whiteSpace: 'nowrap'
          }"
                  :lines = "1">{{item}}</text>
          </div>
        </div>


      </div>
    </div>
  </scroller>
</template>

<script>
  // 其它用法与vue相同
  import OButton from '../OButton'
  import base from '../../mixins/base'
  import dom from '../../modules/dom'
  import OBlock from '../OBlock'

  export default {
    components: {
      OButton: OButton.weexComponent,
      OBlock:OBlock.weexComponent
    },
    mixins: [base],
    props: {
      enable: {
        type: Boolean,
        default: function () {
          return true
        }
      },
      tags: {
        type: Array,
        required: true
      },
      selectid: {
        type: Number,
        default: function () {
          return 0
        }
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
    computed: {
      linearGradient () {
        return 'linear-gradient(' + this.gradientDirection + ',' + this.gradientColors.join(',') + ')'
      },
      inLight () {
//        return this.highLight
      },
      padding: function () {
        return this.borderWidth
//      return this.inLight?this.borderWidth:2
      },
      wrapStyle: function () {
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
          margin: Math.ceil(this.rpx(this.padding)) + 'rpx',
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
    data () {
      console.log('## this.selectid',this.selectid)
      return {
        index: this.selectid
      }
    },
    created () {
      this.rpx(11, true)
    },
    watch: {
      index: function (newid, oldid) {
        console.log('xxx newid=', newid, 'oldid=', oldid)
//        var btn = this.$refs['btn' + newid]
//        dom.scrollToElement(btn, {offset: -300})

         this.$emit('onSelect',newid)
      }
    },
    methods: {
      setIndex (x) {
        console.log('### setIndex ,x=',x)
        this.index = x
        this.$apply()
      },
      onClick: function (key) {
        console.log('taglist onclick',key)
        if (this.enable) {
          this.index = key
//          this.$emit('onSelect', key)
        }
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import "./index.scss"
</style>
