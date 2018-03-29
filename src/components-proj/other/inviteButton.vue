<template>
  <div class = "inviteButton" @click = "clickInvitation">
    <img class = "inviteButton-img" :src = "require('/assets/icon_share.png')"></img>
    <text class = "inviteButton-text">我的邀请卡</text>
  </div>
</template>

<script>
  export default {
    methods: {
      clickInvitation: function () {
        this.$emit('clickInvitation')
      }
    }
  }
</script>

<style lang = "sass" scoped>
  @import './inviteButton.scss'
</style>
