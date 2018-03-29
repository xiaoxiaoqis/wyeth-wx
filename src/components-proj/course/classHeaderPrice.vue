<template>
  <div class="classHeader">
    <text class="classHeader-title">{{classInfo.name}}</text>
    <div class="classHeader-content">
      <text v-if="classInfo.subheader && classInfo.subheader.length > 0" class="classHeader-content-desc" :lines="1">{{classInfo.subheader || ''}}</text>
      <OBlock v-if="classInfo.subheader && classInfo.subheader.length > 0" class="classHeader-content-line" :marginLeft="32" :marginRight="92" :width="2" :height="28" bgColor="#ECECEC"></OBlock>
      <text class="classHeader-content-num" :lines="1">{{hotNum}}人已购买</text>
    </div>
    <div class="classHeader-bottom">
      <text class="classHeader-bottom-price" :lines="1">{{classInfo.price || 0}}MQ</text>
      <div class="classHeader-bottom-buttons">
        <LikeButton :classInfo="classInfo" @clickLike="clickLike"></LikeButton>
        <CollectButton :classInfo="classInfo" @clickCollect="clickCollect"></CollectButton>
      </div>
    </div>
    <div class="classHeader-desc">
      <text class="classHeader-desc-title" :lines="1">简介</text>
      <text class="classHeader-desc-content" :lines="3">{{classInfo.description || ''}}</text>
    </div>
  </div>
</template>

<script>
import LikeButton from './likeButton.vue'
import CollectButton from './collectButton.vue'
import OBlock from '../../components/OBlock/o-block.vue'

export default {
  name: 'classHeader',
  components: {
    LikeButton,
    CollectButton,
    OBlock
  },
  props: {
    classInfo: {
      type: Object,
      required: true
    }
  },
  computed: {
    hotNum: function () {
      let n = parseInt(this.classInfo.buyCount)
      console.log(n)
      if (n >= 10000) {
        return (n / 10000).toFixed(2) + '万'
      } else {
        return n
      }
    }
  },
  methods: {
    clickLike: function (e) {
      this.$emit('clickLike', e)
    },
    clickCollect: function (e) {
      this.$emit('clickCollect', e)
    }
  }
}
</script>


<style lang = "sass" scoped>
    @import './classHeaderPrice.scss'
</style>
