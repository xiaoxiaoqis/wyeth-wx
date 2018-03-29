'use strict';


Page({
  data: {
    hd_url:''
  },
  onLoad() {
    let exchangeInfo = getApp().globalData.exchangeInfo

    getApp().globalData.exchangeInfo = null

    this.setData({
      hd_url: exchangeInfo.hd_url   
    })
  }
});
