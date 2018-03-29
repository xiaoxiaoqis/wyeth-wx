<template>
  <div id = "classHeader">
    <text class = "classHeader-title">{{classInfo.title}}</text>
    <div class = "classHeader-content">
      <div class = "classHeader-tags">
        <image class = "classHeader-tag-img" :src = "require('/assets/tag.png')"/>
        <div class = "classHeader-tag" v-show = "(classInfo.tags && classInfo.tags.length > 0)" v-for = "(tag, i) in classInfo.tags" :key = "i">
          <text class = "classHeader-tag-txt" :lines = "1" @click = "clickTag(tag)">{{tag.name}}</text>
        </div>
      </div>

      <div class = "classHeader-num">
        <text class = "classHeader-text" :lines = "1">{{hotNum || 0}}次播放</text>
        <div class = "classHeader-buttons">
          <LikeButton :classInfo = "classInfo" @clickLike = "clickLike"></LikeButton>
          <CollectButton :classInfo = "classInfo" @clickCollect = "clickCollect"></CollectButton>
        </div>
      </div>
      <OBlock :marginLeft = "15" :marginRight = "15" :width = "720" :height = "2" bgColor = "#eeeeee"></OBlock>
    </div>

  </div>
</template>

<script>
  import LikeButton from './likeButton'
  import CollectButton from './collectButton'
  import OBlock from '../../components/OBlock'
  export default {
    name: 'classHeader',
    components: {
      'LikeButton': LikeButton,
      'CollectButton': CollectButton,
      OBlock: OBlock.weexComponent
    },
    props: {
      classInfo: {
        type: Object,
        required: true
      }
    },
    computed: {
      hotNum: function () {
        let n = parseInt(this.classInfo.hot)
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
      },
      clickTag (tag) {
        this.$emit('clickTag', tag)
      }
    }
  }
</script>

<style lang = "sass" scoped>
  @import './classHeader.scss'
</style>
