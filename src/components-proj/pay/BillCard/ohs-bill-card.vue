<template>
  <div style = "background-color: #ffffff;flex-direction: column">
    <OTextInfoCell1 :height = "116" keyText = "课程" :valueText = "courseName"></OTextInfoCell1>
    <OBlock1 :marginLeft = "24" :marginRight = "25" :height = "1" bgColor = "#eeeeee"></OBlock1>
    <OTextInfoCell2 :height = "116" keyText = "价格" :valueText = "price+'MQ'"></OTextInfoCell2>
    <OBlock2 :marginLeft = "24" :marginRight = "25" :height = "1" bgColor = "#eeeeee"></OBlock2>
    <OTextInfoCell3 :height = "116" keyText = "MQ余额" :valueText = "balance+'MQ'"></OTextInfoCell3>
    <OBlock3 :marginLeft = "24" :marginRight = "25" :height = "1" bgColor = "#eeeeee"></OBlock3>
    <div class = "tip-container">
      <image class = "tip-img" :src = "require('/assets/tip.png')"/>
      <text class = "tip-text">{{remark}}</text>
    </div>
    <OBlock4 :marginLeft = "24" :marginRight = "25" :height = "1" bgColor = "#eeeeee"></OBlock4>
    <div class = "total-container">
      <text class = "total-extra">共计{{courseNum}}节课 小计:</text>
      <text class = "total-num">{{total}}MQ</text>
    </div>
  </div>
</template>

<script>

  import OBlock from '../../../components/OBlock/index'
  import OTextInfoCell from '../../../components/OTextInfoCell/o-text-info-cell.vue'

  module.exports = {

    components: {
      OTextInfoCell1:OTextInfoCell,
      OTextInfoCell2:OTextInfoCell,
      OTextInfoCell3:OTextInfoCell,
      OBlock1: OBlock.weexComponent,
      OBlock2: OBlock.weexComponent,
      OBlock3: OBlock.weexComponent,
      OBlock4: OBlock.weexComponent,
    },
    props: {
      courseName: {
        type: String,
        required: true
      },
      courseNum: {
        type: Number,
        required: true
      },
      balance: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      total: {
        type: Number,
        required: true
      },
      remark: {
        type: String,
        required: false,
        default: ''
      }
    },
    data () {
      return {}
    },
    computed: {
    },
    methods: {}
  }
</script>


<style lang = "sass" scoped>
  @import "./index.scss"
</style>
