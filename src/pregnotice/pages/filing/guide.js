// guide.js
Page({
  data: {
    navTitle: '建档指南',
    desc: '北京市建档指南,生育报销指南及各区社区卫生服务中心都在这里啦~',
    imgUrl: 'http://www.ladybirdedu.com/pregnotice/images/case/20160825/174715316467.jpg',
    district: ['东城', '西城', '朝阳', '海淀', '昌平', '通州', '丰台', '石景山', '门头沟', '房山', '顺义', '大兴', '怀柔', '延庆', '密云', '平谷'],
    baseUrl: 'http://www.ladybirdedu.com/pregnotice/images/case/',
    list: [
      {
        banner: '20161117/b1741d5ae0e67a7e39735a5a8e018074.jpeg',
        title: '北京市建档指南',
        content: [
          {
            subtitle: '居住证办理及领取母子档案问题',
            subContent: '怀孕生育，哪些地方需要用到居住证？',
            id: 11150
          },
          {
            subtitle: '北京公立医院产科建档攻略',
            subContent: '去医院产科建档，最关键的一步是预约（有的医院叫登记）成功',
            id: 11151
          },
          {
            subtitle: '北京母子健康档案办理指南',
            subContent: '《北京市母子健康档案》是什么？',
            id: 11168
          }
        ]
      },
      {
        banner: '20160825/174715316467.jpg',
        title: '北京市生育报销指南',
        content: [
          {
            subtitle: '北京市生育险报销最全Q&A[持续更新]',
            subContent: '北京市生育险报销指南 2016最新版',
            id: 11169
          },
          {
            subtitle: '北京市生育险报销指南',
            subContent: '生育保险用处简要说明，生育保险待遇详解，北京市生育保险报销流程及材料',
            id: 11170
          }
        ]
      },
      {
        banner: '20161117/062c4e37c895d0f8266a532240ef5988.jpeg',
        title: '北京市各区社区卫生服务中心',
        content: []
      }
    ]
  },
  onLoad () {
    let distList = this.data.list[2].content
    this.data.district.forEach((ele, i) => {
      let title = '北京市' + ele + '区社区卫生服务中心'
      let content = title + '信息查询'
      let id = 11152 + i
      distList.push(
        {
          subtitle: title,
          subContent: content,
          id
        }
      )
    }, this)
    this.setData({
      'list[2].content': distList
    })
  }
})
