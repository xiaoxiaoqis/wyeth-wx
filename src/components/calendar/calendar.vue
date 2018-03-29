<template>
    <div class="calendar">
      <div class="header">
        <div class="button"  @click="PreMonth()">
          <image class="arrow left" :src="require('/assets/arrow_left.png')"/>
        </div>
        <text class="title"  @click="ChoseMonth()">{{dateTop}}</text>
        <div class="button"  @click="NextMonth()">
          <image class="arrow right" :src="require('/assets/arrow_right.png')"/>
        </div>
      </div>
      <div class="week">
        <text class="item" v-for="(tag,i) in textTop" :key="i">{{tag}}</text>
      </div>
      <div class="day">
        <div class="item" v-for="(item,index) in list" :style="{border:(item.date === currentDate ? '3px solid #d7b05b;' : ''), backgroundImage: (item.date === selected ? 'linear-gradient(to bottom,#E8C35F,#C79736);' : '#fff;')}" :data-x="item"  :key="index" @click="clickDay(item,index)">
          <text class="text" :style="{color: (item.date === selected ? '#fff' : (item.sign ?'#D89800':'#99999;'))}" v-if="isShowOtherday || ( index + 1 >= item.id && index - item.id  < 7)">{{item.id}}</text>
          <image class="icon" v-if="item.sign && item.date === selected"  :src="require('/assets/right_white.png')"/>
          <image class="icon" v-if="item.sign && item.date !== selected"  :src="require('/assets/right_gold.png')"/>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  props: {
    agoDayHide: { default: "0" },
    futureDayHide: { default: "15181550670000" },
    isShowOtherday: { default: false },
    sign: { default: {} }
  },
  data() {
    return {
      textTop: ["日", "一", "二", "三", "四", "五", "六"],
      myData: [],
      list: [],
      dateTop: "",
      currentDate: null,
      selected: -1
    };
  },
  created() {
    this.myData = new Date();
    this.currentDate = this.dateFormat(new Date());

    this.getList(this.myData);
  },
  methods: {
    clickDay: function(item, index) {
      // if (!(this.isHideOtherday && item.nextDayShow) && !item.dayHide) {
      //   this.$emit("choseDay", item.date);
      // }

      if (item.otherMonth) {
        item.otherMonth < 0
          ? this.PreMonth(item.date)
          : this.NextMonth(item.date);
      } else {
        if (!(this.isHideOtherday && item.nextDayShow) && !item.dayHide) {
          for (var i = 0; i < this.list.length; i++) {
            if (i == index) {
              if (this.list[i].isToday) {
                // 再次点击取消
                this.list[i].isToday = false;

                this.selected = null;

                this.$emit("choseDay", null);
              } else {
                this.list[i].isToday = true;

                this.selected = item.date;

                this.$emit("choseDay", item.date);
              }
            } else {
              this.list[i].isToday = false;
            }
          }
        }
      }
    },
    ChoseMonth: function(date, isChosedDay = true) {
      // date = this.dateFormat(date);
      this.myData = new Date();
      this.$emit("changeMonth", this.dateFormat(this.myData));
      this.getList(this.myData, date, isChosedDay);
    },
    PreMonth: function(date, isChosedDay = true) {
      date = this.dateFormat(date);
      this.myData = this.getPreMonth(this.myData);
      this.$emit("changeMonth", this.dateFormat(this.myData));
      this.getList(this.myData, date, isChosedDay);
    },
    NextMonth: function(date, isChosedDay = true) {
      date = this.dateFormat(date);
      this.myData = this.getNextMonth(this.myData);
      this.$emit("changeMonth", this.dateFormat(this.myData));
      this.getList(this.myData, date, isChosedDay);
    },
    getPreMonth: function(date) {
      var timeArray = this.dateFormat(date).split("/");
      var year = timeArray[0];
      var month = timeArray[1];
      var day = timeArray[2];
      var days = new Date(year, month, 0);
      days = days.getDate();
      var year2 = year;
      var month2 = parseInt(month) - 1;
      if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
      }
      var day2 = day;
      var days2 = new Date(year2, month2, 0);
      days2 = days2.getDate();
      if (day2 > days2) {
        day2 = days2;
      }
      if (month2 < 10) {
        month2 = "0" + month2;
      }
      var t2 = year2 + "/" + month2 + "/" + day2;
      return new Date(t2);
    },
    getNextMonth: function(date) {
      var arr = this.dateFormat(date).split("/");
      var year = arr[0]; //获取当前日期的年份
      var month = arr[1]; //获取当前日期的月份
      var day = arr[2]; //获取当前日期的日
      var days = new Date(year, month, 0);
      days = days.getDate(); //获取当前日期中的月的天数
      var year2 = year;
      var month2 = parseInt(month) + 1;
      if (month2 == 13) {
        year2 = parseInt(year2) + 1;
        month2 = 1;
      }
      var day2 = day;
      var days2 = new Date(year2, month2, 0);
      days2 = days2.getDate();
      if (day2 > days2) {
        day2 = days2;
      }
      if (month2 < 10) {
        month2 = "0" + month2;
      }

      var t2 = year2 + "/" + month2 + "/" + day2;
      return new Date(t2);
    },
    getDaysInOneMonth: function(date) {
      //天数
      var getyear = date.getFullYear();
      var getmonth = date.getMonth() + 1;
      getmonth = parseInt(getmonth, 10);
      var d = new Date(getyear, getmonth, 0);

      return d.getDate();
    },
    getMonthweek: function(date) {
      var getyear = date.getFullYear();
      var getmonth = date.getMonth() + 1;
      var dateOne = new Date(getyear + "/" + getmonth + "/1");
      return dateOne.getDay() == 0 ? 0 : dateOne.getDay();
    },
    getList: function(date, chooseDay, isChosedDay = true) {
      chooseDay = null;
      // 加载前端数据
      let days_sign = [];

      let year = date.getFullYear();

      let month_tmp = parseInt(date.getMonth()) + 1;

      let month = month_tmp < 10 ? "0" + month_tmp : month_tmp.toString();

      if (this.sign[year] && this.sign[year][month]) {
        days_sign = this.sign[year][month];
      }

      var mygetMonth =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      this.dateTop = date.getFullYear() + "年" + mygetMonth + "月";
      var array = [];
      for (var i = 0; i < this.getDaysInOneMonth(date); i++) {
        var nowTime =
          date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + (i + 1);

        let ifSign = false;

        for (let index in days_sign) {
          if (i + 1 === parseInt(days_sign[index])) {
            ifSign = true;
            break;
          }
        }

        if (
          this.dateFormat(new Date()) ==
            this.dateFormat(
              new Date(
                date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + (i + 1)
              )
            ) &&
          !chooseDay
        ) {
          array = array.concat({
            id: i + 1,
            date: nowTime,
            isToday: false,//true,
            sign: ifSign,
            dayHide:
              new Date(nowTime).getTime() < parseInt(this.agoDayHide) ||
              new Date(nowTime).getTime() > parseInt(this.futureDayHide),
            nextDayShow: new Date(nowTime).getTime() > new Date().getTime()
          });
          this.$emit(
            "isToday",
            this.dateFormat(
              new Date(
                date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + (i + 1)
              )
            )
          );
        } else {
          array = array.concat({
            id: i + 1,
            date: nowTime,
            isToday: chooseDay == nowTime && isChosedDay,
            sign: ifSign,
            dayHide:
              new Date(nowTime).getTime() < parseInt(this.agoDayHide) ||
              new Date(nowTime).getTime() > parseInt(this.futureDayHide),
            nextDayShow: new Date(nowTime).getTime() > new Date().getTime()
          });
        }
      }
      var array2 = [];
      var num =
        this.getDaysInOneMonth(this.getPreMonth(date)) -
        this.getMonthweek(date) +
        1;
      var preDate = this.getPreMonth(date);
      var nextDate = this.getNextMonth(date);
      //上个月多少开始
      for (var i = 0; i < this.getMonthweek(date); i++) {
        var nowTime =
          preDate.getFullYear() +
          "/" +
          (preDate.getMonth() + 1) +
          "/" +
          (num + i);
        array2 = array2.concat({
          id: num + i,
          date: nowTime,
          dayHide:
            new Date(nowTime).getTime() < parseInt(this.agoDayHide) ||
            new Date(nowTime).getTime() > parseInt(this.futureDayHide),
          nextDayShow: new Date(nowTime).getTime() > new Date().getTime(),
          otherMonth: -1
        });
      }

      array = array2.concat(array);
      var _length = 7 - array.length % 7;
      if (_length < 7) {
        var nowTime =
          nextDate.getFullYear() +
          "/" +
          (nextDate.getMonth() + 1) +
          "/" +
          (i + 1);
        for (let i = 0; i < _length; i++) {
          array.push({
            id: i + 1,
            date:
              nextDate.getFullYear() +
              "/" +
              (nextDate.getMonth() + 1) +
              "/" +
              (i + 1),
            dayHide:
              new Date(nowTime).getTime() < parseInt(this.agoDayHide) ||
              new Date(nowTime).getTime() > parseInt(this.futureDayHide),
            nextDayShow: new Date(nowTime).getTime() > new Date().getTime(),
            otherMonth: 1
          });
        }
      }

      this.list = array;
    },
    dateFormat: function(date) {
      date = new Date(date);
      return (
        date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate()
      );
    }
  },
  mounted() {
    this.getList(this.myData);
  },
  watch: {
    sign() {
      this.getList(this.myData);
    }
  },
  computed: {}
};
</script>

<style lang = "sass" scoped>
  @import "./index.scss"
</style>