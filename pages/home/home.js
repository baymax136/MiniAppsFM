var app = getApp();
const backgroundAudioManager = wx.getBackgroundAudioManager();
Page({
  data: {
    show: false,
    list: [],
    num: [],
    backgroundAudioid: '',
    backgroundAudioplaying: false,
    backgroundAudioName: '未知音频，请检查网络',
    backgroundAudioImg: 'head_image1@3x.png',
    backgroundText: '未知',

    attentionAnim: '',
    attentionAnim1: '',
    attentionAnim2: '',
    donghua: false,
    onshow: false
  },



  onLoad: function () {
    var attentionAnim = wx.createAnimation({
      duration: 1400,
      timingFunction: 'linear',
      delay: 0
    })
    var attentionAnim1 = wx.createAnimation({
      duration: 1400,
      timingFunction: 'linear',
      delay: 0
    })
    var attentionAnim2 = wx.createAnimation({
      duration: 1400,
      timingFunction: 'linear',
      delay: 0,
      transformOrigin: '50% 50% 0',
    })
    //设置循环动画
    this.attentionAnim = attentionAnim
    this.attentionAnim1 = attentionAnim1
    this.attentionAnim2 = attentionAnim2
    var n = 0;
    var next = true;
    setInterval(function () {
      if (this.data.donghua && this.data.onshow) {
        if (next) {
          //根据需求实现相应的动画
          this.attentionAnim.translateY(-2).step()
          this.attentionAnim1.translateY(2).step()
          this.attentionAnim2.rotate(180 * (n)).step()
          next = !next;
        } else {
          this.attentionAnim.translateY(2).step()
          this.attentionAnim1.translateY(-2).step()
          this.attentionAnim2.rotate(180 * (n)).step()
          next = !next;
        }
        this.setData({
          //导出动画到指定控件animation属性
          attentionAnim: attentionAnim.export(),
          attentionAnim1: attentionAnim1.export(),
          attentionAnim2: attentionAnim2.export(),
          donghua: false,
        })
        n = n + 1
      }
    }.bind(this), 1400)
  },


  onShow: function () {
    var that = this//不要漏了这句，很重要
    var userid = wx.getStorageSync('userid')
    if (userid != "" && userid != null) {
      wx.request({
        url: 'https://reader.fuhuideng.com/login',
        data: {
          'action': 'login',
          'userid': userid
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          var user = res.data
          console.log(user)
          if (user != "" && user != null && user != undefined) {
            wx.setStorageSync('userid', userid)
            app.globalData.userid = userid
            console.log("登录成功" + userid)
          } else {
            console.log(333, '执行到这里，说明后台用户ID登录失败')
            wx.setStorageSync('userid', "")
          }
        },
      })
    }

    that.setData({
      onshow: true
    })

    var list = app.globalData.list;

    var dh = 0;
    backgroundAudioManager.onTimeUpdate(() => {
      const id = app.globalData.playid;
      that.setData({
        backgroundAudioplaying: true,
        donghua: true,
        backgroundAudioid: id,
        backgroundAudioName: list[id + 'val3'],
        backgroundAudioImg: list[id + 'val8'],
        backgroundText: list[id + 'val4']
      });

      backgroundAudioManager.onStop(() => {
        that.setData({
          backgroundAudioplaying: false,
        });
      });
    });

    wx.request({
      url: 'https://reader.fuhuideng.com/getlist', //仅为示例，并非真实的接口地址
      data: '',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          list: res.data
        })
        var listnum = [];
        for (var i = 1; i <= res.data.num; ++i) {
          listnum = listnum.concat(i);
        }
        console.log(listnum);
        that.setData({
          num: listnum,
          show: true
        })
      }
    })
  },

  onHide: function () {
    this.setData({
      onshow: false
    })
  },

  onUnload: function () {
    this.setData({
      onshow: false
    })
  },

  gotoPage: function (event) {
    const number = event.currentTarget.id;//1或者2得到点击了按钮1或者按钮2 
    console.log("++++++++++++++" + number);
    const url = "../play/play?id=" + number;
    app.globalData.list = this.data.list;
    app.globalData.num = this.data.num;
    wx.navigateTo({
      url: url,
    })
  },
})
