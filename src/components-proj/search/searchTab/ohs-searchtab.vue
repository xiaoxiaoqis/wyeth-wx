<template>
    <div class = "ohs-searchbar-tab">
      <div  class = "ohs-searchbar-tab-wrap">
        <!--搜索条-->
        <div ref = "input1" class = "ohs-searchbar-tab-inner"
             @click = "onClick">
          <image class = "ohs-searchbar-tab-icon" :src = "searchIcon"/>
          <text class = "ohs-searchbar-tab-input">{{hintText}}</text>
        </div>
      </div>
    </div>


</template>

<script>
  module.exports = {
    props: {
      hintText: {
        type: String,
        default: function () {
          return '大脑发育'
        }
      }
    },
    data () {
      return {
        searchIcon: require('/assets/search.png')
      }
    },
    methods: {
      onClick () {
        this.$emit('onClick')
      }
    }
  }

</script>

<style lang = "sass" scoped>
  @import "index.scss"
</style>
