<template>
  <div class="progress" :style="{ width: progressWidth_ + 'px', left: scheduleLeft_ + 'px' }">
    <div class="progress-total-bg">
    </div>
    <div class="progress-total">
      <div class="progress-current" :style="{ width:rate * progressWidth_ + 'px' }">
      </div>
      <div class="progress-dot" :style="{left: (dotlock?rate_:rate) * progressWidth_ + 'px'}">
        <text class="progress-time">{{cur_time}} / {{total_time}}</text>
      </div>
    </div>
  </div>
</template>


<script>
import Base from "../../mixins/base";

export default {
  mixins: [Base],
  props: {
    progressWidth: {
      type: Number,
      required: false,
      default: 750
    },
    scheduleLeft: {
      type: Number,
      required: false,
      default: 0
    },
    rate: {
      type: Number,
      required: false,
      default: 0
    },
    currentTime: {
      type: Number,
      required: false,
      default: 0
    },
    duration: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data() {
    return {
      progressWidth_: 500,
      scheduleLeft_: 170,
      rate_: 0,
      dotlock: false
    };
  },
  created() {},
  computed: {
    cur_time: function() {
      return this.timeFormit(this.currentTime);
    },
    total_time: function() {
      return this.timeFormit(this.duration);
    }
  },
  watch: {
    dotlock(val) {
      !val && (this.rate_ = this.rate);
    }
  },
  methods: {
    touchmove: function(e) {
      let offsetX = e.changedTouches[0].clientX * 2.34 - this.scheduleLeft_;

      if (offsetX >= 0 && offsetX <= this.progressWidth_) {
        this.rate_ = offsetX / this.progressWidth_;

        this.$emit("progressChange", this.rate_);
      }
    },
    touchstart: function(e) {
      this.dotlock = true;

      let offsetX = e.changedTouches[0].clientX * 2.34 - this.scheduleLeft_;

      if (offsetX >= 0 && offsetX <= this.progressWidth_) {
        this.rate_ = offsetX / this.progressWidth_;

        this.$emit("progressStart", this.rate_);
      }
    },
    touchend: function(e) {
      let offsetX = e.changedTouches[0].clientX * 2.34 - this.scheduleLeft_;

      if (offsetX >= 0 && offsetX <= this.progressWidth_) {
        this.rate_ = offsetX / this.progressWidth_;

        this.$emit("progressEnd", this.rate_);
      }

      this.dotlock = false;
    },
    timeFormit: function(seconds) {
      seconds = parseFloat(seconds);
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

<style lang = "sass" scoped>
  @import './progress.scss'
</style>
