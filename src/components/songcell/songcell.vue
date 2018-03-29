<template>
  <cell class="songcell selected_cell" @click="clickSong" :style="{backgroundColor: (index === selected) ? '#fbfbfb' : '#ffffff'}">
    <div class="songcell-content">
      <div v-if="(index === selected)" class="songcell_icon" :style="{backgroundImage: 'url(' + (isPlay?require('/assets/songcell_play.gif'):require('/assets/songcell_pause.png')) + ')'}"></div>
      <!-- <img v-if="(index === selected)" class="songcell_icon" :src="isPlay?require('/assets/songcell_play.gif'):require('/assets/songcell_pause.png')"></img> -->
      <text class="songcell_title" :style="{color: (index === selected) ? '#DF940A' : '#444444'}">{{song.title}}</text>
      <div class="songcell_time">
        <img v-if="(index === selected && isPlay)" class="songcell_time_icon" :src="require('/assets/songcell_duration.png')"></img>
        <text class="songcell_time_text">{{timeFormit(song.audio_duration)}}</text>
      </div>
    </div>
    <OBlock :marginLeft="35" :width="715" :height="1" bgColor="#dedede"></OBlock>
  </cell>
</template>

<script>
import Base from '../../mixins/base'
import OBlock from '../../components/OBlock'

export default {
  mixins: [Base],
  components: {
    OBlock: OBlock.weexComponent
  },
  props: {
    song: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: false,
      default: 0
    },
    selected: {
      type: Number,
      required: false,
      default: -1
    },
    isPlay: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    clickSong: function() {
      this.$emit('clickSong', {
        index: this.index
      })
    },
    timeFormit: function(seconds) {
      seconds = parseFloat(seconds)
      if (!seconds || seconds <= 0) {
        return '00:00'
      }
      seconds = parseInt(seconds)

      function add0(m) {
        return m === 0 ? '00' : (m < 10 ? '0' + m : m)
      }
      return add0(parseInt(seconds / 60)) + ':' + add0(seconds % 60)
    }
  }
}
</script>

<style lang = "sass" scoped>
  @import './songcell.scss'
</style>
