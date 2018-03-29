<template>
  <div id = "classlist">
    <panel v-if="classlist.chapter && classlist.chapter.length > 0"
           title="课程大纲"
           :paddingLeft="12"
           :paddingRight="34"
           :titlePaddingLeft="10"
           :extraPaddingRight="27"
           :titleSize="29"
           :extraSize="25"
           :imgBg="'http://wyeth-course.nibaguai.com/wyeth/image/header_bg.png'"
           :imgLeftWitdh="8" titleColor="#af730c"
           extraColor="#666666" :imgLeftHeight="38"
           :imgRightWitdh="28" :imgRightHeight="28" :imgLeft="require('/assets/line.png')"
           :noextra="true"></panel>
    <div id = "chapter" v-for = "(chapter, i) in chapters" :key = "i">
      <text class = "title" :lines = "1">{{chapter.index+'.'+chapter.title}}</text>
      <div id = "sectioncell" @click = "clickSectionCell(section,chapter.index)"
           v-for = "(section, j) in chapter.section" :key = "j">
        <text class = "audition" :lines = "1" v-show = "section.isTest">试听</text>
        <text class = "name" :lines = "1">{{section.title}}</text>
        <image class = "icon" :src = "section.icon"/>
        <text class = "duration" :lines = "1">{{section.timeFormit}}</text>
      </div>
    </div>


  </div>
</template>

<script>
import audioPlayer from "../../modules/audioPlayer";
import panel from "../../components/panel/o-panel.vue";

import event from "../../modules/event";

export default {
  name: "classlist",
  components: {
    panel: panel
  },
  props: {
    classlist: {
      type: Object,
      required: true
    },
    songSelected: {
      type: Object,
      required: false,
      default: {}
    }
  },
  watch: {
    audioPlayer(val) {
      console.log("audioPlayer:", val);
    }
  },
  computed: {
    chapters() {
      let chapters = this.classlist.chapter;

      if (!chapters) {
        return [];
      }

      for (let i = 0; i < chapters.length; i++) {
        let chapter = chapters[i];
        for (let j = 0; j < chapter.section.length; j++) {
          let section = chapter.section[j];
          section.timeFormit = this.timeFormit(section.duration);
          
          if (section.start == this.songSelected.start) {
            if (audioPlayer.isPlay) {
              section.icon = require("/assets/sectioncell_icon_pause.png");
            } else {
              section.icon = require("/assets/sectioncell_icon_play.png");
            }
          } else {
            section.icon = require("/assets/sectioncell_icon_normal.png");
          }
        }
      }

      return chapters;
    }
  },
  created() {
    var self = this;
    event.addEventListener("stateChange", function(state) {
      self.$apply();
    });

    event.addEventListener("progressChange", function(res) {
      if(audioPlayer.songPlay.src !== self.classlist.src){
        return
      }
      let time = res.currentPosition;

      self.classlist.chapter.some(function(chapter) {
        if (chapter && chapter.section) {
          chapter.section.some(function(section) {
            // 增加冗余度
            if (
              time > parseFloat(section.start) + 1 &&
              time < parseFloat(section.end) - 1
            ) {
              self.songSelected = section;
              self.$apply();
            }
          });
        }
      });
    });
  },
  methods: {
    clickSectionCell: function(section, chapterIndex) {
      if (
        section.start === this.songSelected.start &&
        section.end === this.songSelected.end
      ) {
        audioPlayer.start();
      } else {
        this.$emit("clickSectionCell", {
          section: section,
          chapterIndex: chapterIndex
        });
      }
    },
    timeFormit: function(seconds) {
      if (!seconds || seconds <= 0) {
        return "00:00";
      }
      seconds = parseInt(seconds);

      function add0(m) {
        return m === 0 ? "00" : m < 10 ? "0" + m : m;
      }
      return add0(parseInt(seconds / 60)) + ":" + add0(seconds % 60);
    }
  }
};
</script>


<style lang="sass" scoped>
@import './chapterlist.scss'
</style>
