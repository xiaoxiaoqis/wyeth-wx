'use strict';

let router = require('../../modules/router/index')
let network = require('../../modules/network/network')

let choose_year = null;
let choose_month = null;
let dataSource = {
  "2017": {
    "9": [
      1, 2, 3, , 7, 17, 30
    ],
    "10": [
      1, 2, 17
    ]
  },
  "2018": {
    "1": [
      1, 2, 3, , 7, 17, 30
    ],
    "2": [
      1, 2, 17
    ]
  }
};

Page({
  data: {
    tabs:[
      {
        name:"打卡记录",
        choosed:true
      },
      {
        name:"转转乐",
        choosed:false
      }
    ],
    hasEmptyGrid: false,
    showPicker: false,
    exchangeInfo: {
      left_times: 0,
      mq: 0,
      hd_url: "",
      draw_bg: ""
    },
  },
  onLoad() {
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    let userInfo = getApp().globalData.userInfo
    console.log('userInfo:',userInfo.avatar)
    this.calculateDays(cur_year, cur_month);
    this.setData({
      cur_year,
      cur_month,
      weeks_ch,
      userInfo:userInfo
    });

    // 获取抽奖地址
    var self = this
    network.getChance(function (res) {
      console.log('获取抽奖信息：',res)
      if (res.ret === 1) {
        // this.exchangeInfo = data
        self.setData({
          exchangeInfo:res.data
        })
      } else {
      }
    });
  },
  tapTab: function (e){
    const idx = e.currentTarget.dataset.idx;
    // const tabs = this.data.tabs;
    
    // for(let i = 0;i < tabs.length;i++){
    //   tabs[i].choosed = (idx === i)
    // }

    idx === 1 && this.jumpToWebview()

    // this.setData({
    //   tabs
    // });
  },
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  calculateDays(year, month) {
    let days = [];


    let days_sign = []
    let _year = year.toString()
    let _month = month.toString()

    if (dataSource[_year] && dataSource[_year][_month]) {
      days_sign = dataSource[_year][_month]
    }

    let contains = function (day) {
      for (let i = 0; i < days_sign.length; i++) {
        let value = days_sign[i]
        if (day === value) {
          return true
        } else if (day < value) {
          return false
        }
      }
    }

    const thisMonthDays = this.getThisMonthDays(year, month);
    let date = new Date();
    let cur_year = date.getFullYear();
    let cur_month = date.getMonth() + 1;
    let cur_day = date.getDate()

    let choose, sign = false

    for (let i = 1; i <= thisMonthDays; i++) {
      if (year === cur_year && month === cur_month && i === cur_day) {
        choose = true
      } else {
        choose = false
      }

      sign = contains(i)

      days.push({
        day: i,
        choosed: choose,
        sign: sign || choose
      });
    }

    this.setData({
      days
    });
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      });

    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      });
    }
  },
  tapDayItem(e) {
    const idx = e.currentTarget.dataset.idx;
    const days = this.data.days;
    days[idx].choosed = !days[idx].choosed;
    this.setData({
      days,
    });
  },
  chooseYearAndMonth() {
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    let picker_year = [],
      picker_month = [];
    for (let i = 1900; i <= 2100; i++) {
      picker_year.push(i);
    }
    for (let i = 1; i <= 12; i++) {
      picker_month.push(i);
    }
    const idx_year = picker_year.indexOf(cur_year);
    const idx_month = picker_month.indexOf(cur_month);
    this.setData({
      picker_value: [idx_year, idx_month],
      picker_year,
      picker_month,
      showPicker: true,
    });
  },
  pickerChange(e) {
    const val = e.detail.value;
    choose_year = this.data.picker_year[val[0]];
    choose_month = this.data.picker_month[val[1]];
  },
  tapPickerBtn(e) {
    const type = e.currentTarget.dataset.type;
    const o = {
      showPicker: false,
    };
    if (type === 'confirm') {
      o.cur_year = choose_year;
      o.cur_month = choose_month;
      this.calculateEmptyGrids(choose_year, choose_month);
      this.calculateDays(choose_year, choose_month);
    }

    this.setData(o);
  },
  switchChange: function (e){
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
  },
  onShareAppMessage() {
    return {
      title: '惠氏',
      desc: '',
      path: '/mix/mine/index'
    };
  },
  jumpToWebview() {
    getApp().globalData.exchangeInfo = this.data.exchangeInfo

    router.push({ url: "/mix/webview/index"})
  }
});
