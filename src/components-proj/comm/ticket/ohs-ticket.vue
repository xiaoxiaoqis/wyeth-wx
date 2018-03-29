/**
 * Created by admin on 17/8/17.
 */
<template>
  <OPopupWindow :hasCancel = "false" @onDoneClick = "onClick"
                doneText = "立即使用"
                title = "恭喜获得分享好礼!">
    <div class = "ticket-container">
      <image class = "ticket-img" :src = "require('/assets/ticket.png')"/>
      <div class = "ticket-content">
        <text class = "ticket-text">{{title}}</text>
        <text class = "ticket-subtitle">{{subtitle}}</text>
      </div>
    </div>
  </OPopupWindow>
</template>

<script>
// 其它用法与vue相同
import OPopupWindow from '../../../components/OPopupWindow'
export default {
  components: {
    OPopupWindow: OPopupWindow.weexComponent
  },
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: true
    }
  },
  data () {
    return {}
  },
  methods: {
    onClick () {
      this.$emit('onClick')
    }
  },
  created () {},
  mounted () {}
}
</script>

<style lang = "sass" scoped>
  @import "index"
</style>
