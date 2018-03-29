<template>
  <div class="o-cells-class-header"
       :style="headerStyle" >
    <div class="o-cells-div-header-title" >
      <image class="o-cells-title-img"
             :src="imgLeft"
             v-show="imgLeft!==''"
             :style="imgLeftStyle"/>
      <text class="o-cells-header-title"
            :style="titleStyle"
            :lines="1">{{title}}</text>
    </div>
    <div class="o-cells-div-more" :id="rightid" v-show="!noextra" @click="more">
      <text class="o-cells-more-text"
            :style="extraStyle">{{extra}}</text>
      <image class="o-cells-more-img"
             :style="imgRightStyle"
             :src="imgRight"/>
    </div>
  </div>
</template>
<script>
// 其它用法与vue相同
import Base from '../../mixins/base'
export default {
  mixins:[Base],
  props: {
    rightid:String,
    bgColor:{
      type:String,
      default:'#ffffff'
    },
    imgBg:{
      type:String,
      default:''
    },
    imgLeftWidth:{
      type:Number,
      default:10
    },
    imgLeftHeight:{
      type:Number,
      default:38
    },
    imgRightWidth:{
      type:Number,
      default:28
    },
    imgRightHeight:{
      type:Number,
      default:28
    },
    imgLeft:{
      type:String,
      default:''
    },
    imgRight:{
      type:String,
      default: '/assets/more.png'
    },
    title:{
      type:String,
      required:true
    },
    titleColor:{
      type:String,
      default:'#000000'
    },
    extraColor:{
      type:String,
      default:'#000000'
    },
    extra:{
      type:String,
      default:'更多'
    },
    noextra:{
      type:Boolean,
      default:function () {
        return false
      }
    },
    height:{
      type:Number,
      default:86
    },
    extraSize:{
      type:Number,
      default:25
    },
    titleSize:{
      type:Number,
      default:29
    },
    paddingRight:{
      type:Number,
      default:10
    },
    paddingLeft:{
      type:Number,
      default:10
    },
    titlePaddingLeft:{
      type:Number,
      default:10
    },
    titlePaddingRight:{
      type:Number,
      default:10
    },
    extraPaddingLeft:{
      type:Number,
      default:10
    },
    extraPaddingRight:{
      type:Number,
      default:10
    }
  },
  data () {
    return {
      name: 'testname',
      headerStyle:{
        height:this.rpx(this.height,true),
        backgroundImage: this.imgBg==''?'none':'url('+this.imgBg+')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundColor: this.bgColor,
        paddingLeft: this.rpx(this.paddingLeft,true),
        paddingRight:this.rpx(this.paddingRight,true)
      },
      titleStyle:{
        fontSize: this.rpx(this.titleSize,true),
        color:this.titleColor,
        paddingLeft: this.rpx(this.titlePaddingLeft,true),
        paddingRight:this.rpx(this.titlePaddingRight,true)
      },
      extraStyle:{
        fontSize: this.rpx(this.extraSize,true),
        color:this.extraColor,
        paddingLeft: this.rpx(this.extraPaddingLeft,true),
        paddingRight:this.rpx(this.extraPaddingRight,true)
      },
      imgLeftStyle:{
        width:this.rpx(this.imgLeftWidth,true),
        height:this.rpx(this.imgLeftHeight,true)
      },
      imgRightStyle:{
        width:this.rpx(this.imgRightWidth,true),
        height:this.rpx(this.imgRightHeight,true)
      }
    }
  },

  created() {
    console.log('bg'+this.imgBg)
  },
  methods: {
    more:function () {
      this.$emit('more')
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "./index.scss"
</style>
