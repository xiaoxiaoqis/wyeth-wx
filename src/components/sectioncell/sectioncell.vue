<template>
  <div id="sectioncell" @click="clickSectionCell">
    <text class="audition" :lines="1" v-show="section.isTest">试听</text>
    <text class="name" :lines="1">{{section.title}}</text>
    <image class="icon" :src="icon"/>
    <text class="duration" :lines="1">{{timeFormit(section.duration)}}</text>
  </div>
</template>

<script>
  import audioPlayer from '../../modules/audioPlayer'

  export default {
    name: 'sectioncell',
    props: {
      chapterIndex: {
        type:Number,
        required:true
      },
      section: {
        type: Object,
        required: true
      },
      songSelected: {
        type: Object,
        required: false,
        default: {}
      },
    },
    computed: {
      icon: function() {
        if (this.isSelected) {
          if (audioPlayer.isPlay) {
            return require('/assets/sectioncell_icon_pause.png')
          } else {
            return require('/assets/sectioncell_icon_play.png')
          }
        } else {
          return require('/assets/sectioncell_icon_normal.png')
        }
      },
      isSelected: function() {
        return this.section === this.songSelected
      }
    },
    methods: {
      clickSectionCell: function() {
        var self = this
        if (this.isSelected) {
          audioPlayer.start()
        } else {
          this.$emit('clickSectionCell', { section: self.section,chapterIndex:self.chapterIndex })
        }
      },
      timeFormit: function(seconds) {
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
  @import './sectioncell.scss';
</style>
