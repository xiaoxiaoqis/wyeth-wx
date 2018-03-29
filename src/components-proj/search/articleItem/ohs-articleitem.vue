<template>
  <div class="ohs-article-container">
    <image class="ohs-article-cover" :src="obj.img"/>
    <div class="ohs-article-layout">
      <text class="ohs-article-title">{{obj.title}}</text>
      <div class="ohs-article-extra">
        <div class="ohs-article-source-layout">
          <image class="ohs-article-source-tag" :src="require('/assets/tag.png')"/>
          <text class="ohs-article-source">{{obj.source}}</text>
        </div>
        <text class="ohs-article-num">{{obj.num}}人阅读</text>
      </div>
    </div>
  </div>
</template>

<script>
// 其它用法与vue相同
export default {
  props: {
    obj: {
      type: Object,
      required: true
    }
  },
  data () {
    return {

    }
  },
  methods: {}
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
