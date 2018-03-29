// orderDetail.js
Page({
  data: {
    curFlow: 2,
    state: '',
    doneIcon: 'http://www.ladybirdedu.com//pregnotice/images/wx-static/bigCorrect.png',
    classArray: []
  },
  onLoad () {
    this.getTest()
  },
  phoneCall () {
    wx.makePhoneCall({
      phoneNumber: '15366140236'
    })
  },
  getTest () {
    let className = []
    for (let i = 0; i < 5; i++) {
      if (this.data.curFlow === i) {
        className[i] = 'doing'
      } else if (this.data.curFlow > i) {
        className[i] = 'done'
      } else { className[i] = '' }
    }
    className.forEach((el, index) => {
      this.data.classArray[index] = el
      this.setData({
        classArray: this.data.classArray
      })
    })
    console.log(this.data)
  }
})
