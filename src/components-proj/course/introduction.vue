<template>
  <div id = "introduction">
    <text class = "introduction-title" :lines = "1">{{classInfo.title}}</text>
    <Usercell :userInfo = "userInfo" @clickConcern = "clickConcern"></Usercell>
    <text class = "introduction-title_1" :lines = "1">简介</text>
    <text class = "introduction-content" :lines = "3">{{classInfo.course_desc}}</text>
    <div class = "introduction-tags">
      <image class = "introduction-tag-img" :src = "require('/assets/tag.png')"/>
      <div class = "introduction-tag" v-show = "(classInfo.tags && classInfo.tags.length > 0)" v-for = "(tag, i) in classInfo.tags" :key = "i">
        <text class = "introduction-tag-txt" :lines = "1" @click = "clickTag(tag)">{{tag.name}}</text>
      </div>
    </div>

    <div class = "introduction-footer">
      <text class = "introduction-footer-text" :lines = "1">已有 {{classInfo.hot}}人参加</text>
      <div class = "introduction-footer-buttons">
        <LikeButton :classInfo = "classInfo" @clickLike = "clickLike"></LikeButton>
        <CollectButton :classInfo = "classInfo" @clickCollect = "clickCollect"></CollectButton>
      </div>
    </div>
  </div>
</template>

<script>

  import Usercell from '../../components/usercell/usercell'
  import LikeButton from './likeButton'
  import CollectButton from './collectButton'

  export default {
    name: 'introduction',
    components: {
      'Usercell': Usercell,
      'LikeButton': LikeButton,
      'CollectButton': CollectButton
    },
    props: {
      userInfo: {
        type: Object,
        required: true
      },
      classInfo: {
        type: Object,
        required: true
      }
    },
    computed: {
      nums() {
//        return this.num2str(this.classInfo.hot)
      }
    },
    methods: {
      clickLike: function (e) {
        this.$emit('clickLike', e)
      },
      clickCollect: function (e) {
        this.$emit('clickCollect', e)
      },
      clickConcern: function (e) {
        this.$emit('clickConcern', e)
      },
      clickTag (tag) {
        this.$emit('clickTag', tag)
      }
    }
  }
</script>


<style lang="sass" scoped>
  @import './introduction.scss'
</style>
