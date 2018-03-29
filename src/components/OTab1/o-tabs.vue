<template>
  <div style="align-items: stretch">
    <div class="o-tab-nav" ref="tabs">
      <div v-for="(tab,i) in tabs" :key="i" class="o-tab" @click="selectTab(tab)">
        <!--<CIcon v-if="tab.icon" class="o-tab_icon" :class="tab.value === value? 'o-tab-active' : ''" :iconID="`${tab.icon}`"></CIcon>-->
        <text class="o-tab_text" :class="tab.value === value? 'o-tab-active' : ''">{{tab.label}}</text>
      </div>
      <!-- <div v-animation="anim"  class="o-tab-line" ref="line" style="width: 136px;"></div> -->
    </div>
    <div style="flex: 1;">
      <slot></slot>
    </div>
  </div>
</template>
<script>
//  import CIcon from '../icon/C-Icon'
  import Base from '../../mixins/base'
  import event from '../../modules/event/index'

  export default {
    mixins: [Base],
    name: 'OTabs',
    components: {
//      CIcon
    },
    props: {
      // 属性值
      value: {
        type: [String, Number, Boolean, Object, Array],
        default: 0
      },
      // 图标
      icon: {
        type: [String, Number, Boolean, Object, Array],
        default: ''
      },
      // 默认颜色
      defaultcolor: {
        default: '#333;'
      },
      activecolor: {
        default: '#eb7b09'
      }
    },
    data () {
      console.log('xxx data')
      return {
        tabs: [],
        color: this.defaultcolor,
        anim: {}
        //        lineWidth: this.rpx(136,false)
      }
    },
    computed: {
      activeIndex () {
        return [
          this.tabs.map(function (tab) { return tab.value }).indexOf(this.value) || 0
        ]
      }
    },
    watch: {
      value (val) {
        let self =this
        event.sendEvent('OTab-change',val)
        this.$nextTick(function () {
//          self.animateLine()
        })
      },
      activeIndex (val) {
        this.animateLine()
      }
    },
    methods: {
      addTab (tab) {
        console.log('xxx addTab',tab)
        let self=this
        setTimeout(function () {
          console.log('xxx push addTab')
          self.tabs.push(tab)
          self.$apply()
        }, 0)
      },
      removeTab (tab) {
        this.tabs.splice(this.tabs.indexOf(tab), 1)
      },
      selectTab (tab) {
        this.$emit('onTabChange', tab.value)
      },
      animateLine () {
        let res=wx.getSystemInfoSync()
        let dpr=750/res.windowWidth
        let x=this.activeIndex * 750 / this.tabs.length + (750 / this.tabs.length - 148) / 2
        this.createAnimation({
          styles: {
            transform: `translateX(${x/dpr}px)`
          },
          duration: 300,
          timingFunction: 'ease',
          delay: 0
        },'anim')
      }
    },
    created () {
      let self=this
      self.onAddTab=function (data) {
        self.addTab(data)
      }
      event.addEventListener('OTab1-addTab',self.onAddTab)
      event.sendEvent('OTab-change',this.value, true)
    },
    activated () {
      console.log('xxx tabs activated')
    },
    beforeDestroy () {
      console.log('### beforeDestroy')
      if (this.onAddTab) {
        event.removeEventListener('OTab1-addTab', this.onAddTab)
      }
    }

  }
</script>
<style lang="sass" scoped>
  @import 'o-tabs.scss'
</style>
