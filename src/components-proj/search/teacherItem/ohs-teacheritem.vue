<template>
  <div class="ohs-teacher-container">
    <image class="ohs-teacher-icon" :src="obj.avatar"/>
    <div>
      <div class="ohs-teacher-layout">
        <text class="ohs-teacher-text-name" style="color: #333333">{{obj.name}}</text>
        <OBlock :width="2" :marginLeft="30" :marginRight="22" :height="26" bgColor="#999999"/>
        <!--<text class="ohs-teacher-text-hospital" v-show="obj.hospital">{{obj.hospital}}</text>-->
        <text class="ohs-teacher-text-position" v-show="obj.position">{{obj.position}}</text>
      </div>
      <div class="ohs-teacher-layout">
        <text class="ohs-teacher-text-answer" >{{obj.count}}个收藏</text>
      </div>
    </div>
  </div>
</template>

<script>
// 其它用法与vue相同
import OBlock from '../../../components/OBlock/index'
export default {
  components: {
    OBlock: OBlock.weexComponent
  },
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
