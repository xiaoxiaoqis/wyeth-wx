<template>
  <div id = "usercell">
    <image class = "avatar" :src = "userInfo.teacher_avatar"/>
    <text class = "name">{{userInfo.teacher_name}}</text>
    <text class = "hospital">{{userInfo.teacher_hospital}}</text>
    <text class = "position">{{userInfo.teacher_position}}</text>
    <button class = "concern" :style = "{color: concern ? concernStyle[1].buttonColor : concernStyle[0].buttonColor,borderColor:concern ? concernStyle[1].buttonColor : concernStyle[0].buttonColor}" @click = "clickConcern">{{ concern?concernStyle[1].buttonTitle : concernStyle[0].buttonTitle}}</button>
  </div>
</template>

<script>

  import network from '../../modules/network/network'
  import event from '../../modules/event'
  import validate from '../../modules/validate'

  export default {
    name: 'usercell',
    props: {
      userInfo: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        concernStyle: [
          {
            buttonColor: '#ce8803',
            buttonTitle: '+关注'
          },
          {
            buttonColor: '#c7c7c7',
            buttonTitle: '已关注'
          }
        ]
      }
    },
    computed: {
      concern: function () {
        return this.userInfo.concern || false
      }
    },
    methods: {
      clickConcern: function () {
        console.log('点击关注')

      if (validate.checkRegister()) {
        return
      }
      
        var self = this

        network.observePro({ pro_id: this.userInfo.teacher_id, is_cancel: this.userInfo.concern }, res => {
          if (res.ret === 1) {
            event.sendEvent('toast', { type: 'success', text: (self.userInfo.concern === 1) ? '取关成功' : '关注成功' })

            console.log(res)
            self.$emit('clickConcern', {
              teacher_id: self.userInfo.teacher_id,
              concern: (self.userInfo.concern === 1) ? 0 : 1
            })
          }
        })
      }
    }
  }
</script>

<style lang = "sass" scoped>
  @import './usercell.scss'
</style>
