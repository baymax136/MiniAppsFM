// pages/play/play.js
var app = getApp();
const backgroundAudioManager = wx.getBackgroundAudioManager();
var height = 0;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    musicid: 0,
    tapTime: "",//进度条拖动动作完成后的百分s比
    showView: false,//播放按键切换
    showTime: "00:00",//音乐总时长
    time: "00:00", //当前播放时间
    clickVar: 0,//进度条操作完成后的百分比
    sliderValue: 0,//显示的百分比
    showValue: true,//播放时移动进度条控制器
    showLike: true,
    showList: false,
    showcolor: false,//是否是在当前页面

    title: '加载音频失败请重新启动',
    speaker: '加载失败',
    writer: '加载失败',
    url: '',
    src: 'head_image1@3x.png',

    list: [],
    num: [],

    // 用户输入的金额
    moneyNum: null,

    showrewardList: false,
  },

  onLoad: function (options) {
    //页面点击的 页面循环的下标也就是我们json的第一个引索数
    var id = options.id;
    //得到播放列表
    var list = app.globalData.list;
    //得到播放列表音频数量
    var num = app.globalData.num;

    var that = this

    console.log(list)
    console.log(num)

    if (!app.globalData.playing && id != app.globalData.playid) {
      wx.showToast({
        icon: "none",
        title: "开始播放这个音频",
      })
      that.setData({
        id: id,
        list: list,
        num: num,
      })
      that.setData({
        musicid: list[id + 'val1'],
        title: list[id + 'val3'],
        speaker: list[id + 'val4'],
        writer: list[id + 'val5'],
        url: list[id + 'val7'],
        src: list[id + 'val8'],
      })
      that.playAudio();
      that.initAudio();
    } else {
      if (id != app.globalData.playid) {
        wx.showToast({
          icon: "none",
          title: "切换到这个音频",
        })
        that.setData({
          id: id,
          list: list,
          num: num,
        })
        that.setData({
          musicid: list[id + 'val1'],
          title: list[id + 'val3'],
          speaker: list[id + 'val4'],
          writer: list[id + 'val5'],
          url: list[id + 'val7'],
          src: list[id + 'val8'],
        })
        that.playAudio();
        that.initAudio();
      } else {
        wx.showToast({
          icon: "none",
          title: "后台正在播放这个音频",
        })
        that.setData({
          id: id,
          list: list,
          num: num,
        })
        that.setData({
          musicid: list[id + 'val1'],
          title: list[id + 'val3'],
          speaker: list[id + 'val4'],
          writer: list[id + 'val5'],
          url: list[id + 'val7'],
          src: list[id + 'val8'],
        })
        that.initAudio();
        that.initTime();
        backgroundAudioManager.play();
      }
    }
    that.seeIfLike();
  },

  likeistrue() {
    var that = this
    that.setData({
      showLike: false
    });

    if (that.data.showcolor) {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#DA5F63'
      });
    }

    app.background(that, 'slide_show1', '#DA5F63', 1);
  },

  likeisfalse() {
    var that = this
    that.setData({
      showLike: true
    });
    if (that.data.showcolor) {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#4B99D1'
      });
    }
    app.background(this, 'slide_show1', '#4B99D1', 1);
  },



  seeIfLike() {
    //查看是否喜欢
    var userid = wx.getStorageSync('userid')
    if (userid != "") {
      var musicid = this.data.musicid
      var that = this
      wx.request({
        url: 'https://reader.fuhuideng.com/like', //仅为示例，并非真实的接口地址
        data: {
          'action': 'seelike',
          'userid': userid,
          'musicid': musicid,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log("musicid:" + musicid + "-seeIfLike()查看是否喜欢:" + res.data)
          if (res.data > 0) {
            that.likeistrue();
          } else {
            that.likeisfalse();
          }
        }
      })
    }
  },

  seeIfHistory() {
    //查看是否在最近听过的列表
    var userid = wx.getStorageSync('userid')
    if (userid != "") {
      var musicid = this.data.musicid
      var that = this
      wx.request({
        url: 'https://reader.fuhuideng.com/history',
        data: {
          'action': 'seehistory',
          'userid': userid,
          'musicid': musicid,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log("musicid:" + musicid + "-seeIfHistory()查看是否听过:" + res.data)
          if (res.data > 0) {
            //听过
            that.historyupdate();
          } else {
            //没听过
            that.historyisfalse();
          }
        }
      })
    }
  },

  historyisfalse() {
    var userid = wx.getStorageSync('userid')
    if (userid != "") {
      var id = this.data.musicid
      var that = this
      wx.request({
        url: 'https://reader.fuhuideng.com/history',
        data: {
          'action': 'addhistory',
          'musicid': id,
          'userid': userid
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data == 'ok') {
            console.log("[userid]:" + userid + " [musicid]" + id + "听了这个音频")
          }
        }
      })
    } else {
      wx.showToast({
        title: "请先登录才能使用哟～",
        icon: 'none',
        duration: 2000
      });
    }
  },

  historyupdate() {
    var userid = wx.getStorageSync('userid')
    if (userid != "") {
      var id = this.data.musicid
      var that = this
      wx.request({
        url: 'https://reader.fuhuideng.com/history',
        data: {
          'action': 'updatehistory',
          'musicid': id,
          'userid': userid
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data == 'ok') {
            console.log("[userid]:" + userid + " [musicid]" + id + "更新听了这个音频")
          }
        }
      })
    } else {
      wx.showToast({
        title: "请先登录才能使用哟～",
        icon: 'none',
        duration: 2000
      });
    }
  },


  // 化为时分秒
  formatMs2Obj(total) {
    var h = this.repairZero(Math.floor(total / 3600))
    var m = this.repairZero(Math.floor((total - h * 3600) / 60))
    var s = this.repairZero(Math.floor(total - h * 3600 - m * 60))
    //ES6 结构  h:h
    return {
      h,
      m,
      s
    }
  },
  // 补零
  repairZero(num) {
    return num < 10 ? ("0" + num) : num
  },

  playAudio() {
    //播放音乐
    backgroundAudioManager.title = this.data.title;
    backgroundAudioManager.epname = this.data.writer;
    backgroundAudioManager.singer = this.data.speaker;
    backgroundAudioManager.coverImgUrl = 'http://cdn.fuhuideng.com/head_image/' + this.data.src;
    // 设置了 src 之后就会自动播放，若此处不设置src默认将为空字符串，当设置了src可以播放音乐
    backgroundAudioManager.src = encodeURI(this.data.url);
    console.log(encodeURI(this.data.url));
    //更新环境变量
    app.globalData.playid = this.data.id;
  },

  // 点击播放列表事件
  taplist: function (event) {
    const id = event.currentTarget.id;//1或者2得到点击了按钮1或者按钮2 
    if (id != app.globalData.playid) {
      wx.showToast({
        icon: "none",
        title: "切换到这个音频",
      })
      this.playNextAudio(id);
    } else {
      wx.showToast({
        icon: "none",
        title: "后台正在播放这个音频",
      })
    }
  },


  playNextAudio(id) {
    var list = this.data.list;
    var id = id;

    var listnum = parseInt(this.data.list.num)
    if (id > listnum) {
      id = 1;
    }

    if (id < 1) {
      id = listnum;
    }

    console.log(list);
    console.log(id);
    //更新环境变量
    app.globalData.playid = id;

    var title = list[id + 'val3'];
    var epname = list[id + 'val5'];
    var singer = list[id + 'val4'];
    var coverImgUrl = list[id + 'val8'];
    var src = list[id + 'val7'];

    backgroundAudioManager.title = title;
    backgroundAudioManager.epname = epname;
    backgroundAudioManager.singer = singer;
    backgroundAudioManager.coverImgUrl = 'http://cdn.fuhuideng.com/head_image/' + coverImgUrl;
    backgroundAudioManager.src = encodeURI(src);

    this.setData({
      musicid: list[id + 'val1'],
      id: id,
      title: title,
      speaker: singer,
      writer: epname,
      url: src,
      src: coverImgUrl,
    });

    this.seeIfLike();
  },

  //音频总时长设置
  initTime() {
    var obj = this.formatMs2Obj(backgroundAudioManager.duration)
    var str = obj.m + ":" + obj.s
    this.setData({
      showTime: str
    });
  },

  initAudio() {
    //更新环境变量
    app.globalData.playid = this.data.id;

    backgroundAudioManager.onPlay(() => {
      console.log('开始播放');
      this.seeIfHistory();
      app.globalData.playing = true;
      this.initTime();
      this.setData({
        showView: false
      });
    });

    backgroundAudioManager.onEnded(() => {
      console.log('播放完成切换下一首');
      this.playNextAudio(parseInt(this.data.id) + 1);
    });

    backgroundAudioManager.onStop(() => {
      app.globalData.playing = false;
      this.setData({
        showView: true
      });
    });

    // 播放过程中
    backgroundAudioManager.onTimeUpdate(() => {
      if (this.data.showValue) {
        var playValue = (backgroundAudioManager.currentTime / backgroundAudioManager.duration) * 100
        this.setData({
          sliderValue: playValue
        });
        var obj = this.formatMs2Obj(playValue / 100 * backgroundAudioManager.duration)
        var str = obj.m + ":" + obj.s
        this.setData({
          time: str
        });
      }
    });

    backgroundAudioManager.onPause(() => {
      console.log('Pause');
      this.setData({
        showView: true
      });
    })

    backgroundAudioManager.onPrev(() => {
      this.playNextAudio(parseInt(this.data.id) - 1);
    })

    backgroundAudioManager.onNext(() => {
      this.playNextAudio(parseInt(this.data.id) + 1);
    })

    //播放错误
    backgroundAudioManager.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
      wx.showToast({
        title: '错误:' + res.errMsg + '自动切换下一首',
        icon: "none"
      })
      this.playNextAudio(parseInt(this.data.id) + 1);
    })
  },

  //进度条拖动
  changing: function (event) {
    this.data.showValue = false
    if (event.detail.value != this.data.tapTime) {
      this.setData({ tapTime: event.detail.value });
      this.sliderchanging();
    }
  },

  sliderchanging() {
    var obj = this.formatMs2Obj(this.data.tapTime / 100 * backgroundAudioManager.duration)
    var str = obj.m + ":" + obj.s
    this.setData({
      time: str
    });
  },

  bindchange: function (event) {
    console.log("bindchange");
    console.log(event.detail.value);
    this.setData({
      clickVar: event.detail.value
    });

    var s = this.data.clickVar / 100 * backgroundAudioManager.duration
    var obj = this.formatMs2Obj(s)
    var str = obj.m + ":" + obj.s
    this.setData({
      time: str
    });

    console.log('执行进度调整');
    backgroundAudioManager.seek(s)
    this.data.showValue = true
  },


  //进度条点击
  onItemClick: function (event) {
    wx.showToast({
      icon: "none",
      title: "执行进度调整=" + this.data.clickVar,
    })
  },
  //进度条END

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getSystemInfo({
      success(res) {
        // console.log(res.model)
        // console.log(res.pixelRatio)
        // console.log(res.windowWidth)
        // console.log(res.windowHeight)
        height = res.windowHeight;
        // console.log(res.language)
        // console.log(res.version)
        // console.log(res.platform)
        // console.log(res.environment)
      }
    })
    app.show(this, 'slide_show1', 1);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.show(this, 'slide_show1', 1);
    this.setData({
      showcolor: true,
    });
  },

  //播放音乐
  play: function () {
    if (app.globalData.playing) {
      backgroundAudioManager.play();
    } else {
      this.playAudio();
    }

    this.setData({
      showView: true
    });
  },

  pause: function () {
    backgroundAudioManager.pause();
    this.setData({
      showView: false
    });
  },

  prev: function () {
    this.playNextAudio(parseInt(this.data.id) - 1);
  },
  next: function () {
    this.playNextAudio(parseInt(this.data.id) + 1);
  },


  like: function () {
    var userid = wx.getStorageSync('userid')
    if (userid != "") {
      var id = this.data.musicid
      var userid = wx.getStorageSync('userid')
      var that = this
      console.log("[userid]:" + userid + " [musicid]" + id + "喜欢了这个音频")

      wx.request({
        url: 'https://reader.fuhuideng.com/like', //仅为示例，并非真实的接口地址
        data: {
          'action': 'like',
          'musicid': id,
          'userid': userid
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          that.likeistrue();
        }
      })

      // setTimeout(function () {
      //   app.show(this, 'slide_show1', 1)
      // }.bind(this), 400);

    } else {
      wx.showModal({
        title: '提示',
        content: '需要先登录才能使用哟,您现在要去登录页面吗？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.switchTab({
              url: "/pages/my/my",
            })
          } else {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  likeclick: function () {
    var id = this.data.musicid
    var userid = wx.getStorageSync('userid')
    var that = this
    wx.request({
      url: 'https://reader.fuhuideng.com/like', //仅为示例，并非真实的接口地址
      data: {
        'action': 'dellike',
        'musicid': id,
        'userid': userid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data == "ok") {
          that.likeisfalse();
        }
      }
    })
  },


  seereward: function () {
    var that = this
    var userid = wx.getStorageSync('userid')
    if (userid != "") {
      this.setData({
        showrewardList: true,
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '需要先登录才能使用哟,您现在要去登录页面吗？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.switchTab({
              url: "/pages/my/my",
            })
          } else {
            console.log('用户点击取消')
          }
        }
      })
    }













  },

  closelist: function () {
    this.setData({
      showrewardList: false,
    })
  },


  money(val) {
    let num = val.toString(); //先转换成字符串类型
    if (num.indexOf('.') == 0) { //第一位就是 .
      num = '0' + num
    }
    num = num.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
    num = num.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    num = num.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    
    if(parseInt(num.length)> 7){
      var str_before = num.split('.')[0];
      var str_after = num.split('.')[1];
      
      var str_before_length = parseInt(str_before.length)

      var str_after_length  = 0;
      if (str_after != null && str_after != undefined){
        str_after_length = parseInt(str_after.length)
      }
      // console.log('前：' + str_before + ' - 后：' + str_after)
      if (str_before_length > 7){
        str_before = str_before.substring(0, 7);
        console.log(str_before)
        num = str_before
        if (str_after_length > 0){
          num = str_before + '.' + str_after
        } 
      }
    }
    if (num.indexOf(".") < 0 && num != "") {
      num = parseFloat(num);
    }
    return num
  },

  inputedit(event) {
    this.setData({
      moneyNum: this.money(event.detail.value)
    })
  },



  tapreward: function (event) {
    var that = this
    var userid = wx.getStorageSync('userid')
    var number = event.currentTarget.id//1或者2得到点击了按钮1或者按钮2 
    if (userid != "") {
      if (number == "zdy"){
        number = that.data.moneyNum
      }
      if (number != null&&number!=0){
        console.log(number);
        that.reward(number*100);
      }else{
        wx.showToast({
          title: "请输入正确的打赏金额",
          icon: 'none',
          duration: 2000
        });
      }
      
    } else {
      wx.showModal({
        title: '提示',
        content: '需要先登录才能使用哟,您现在要去登录页面吗？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.switchTab({
              url: "/pages/my/my",
            })
          } else {
            console.log('用户点击取消')
          }
        }
      })
    }
  },



  reward(num) {
    var id = this.data.musicid
    var userid = wx.getStorageSync('userid')
    var that = this
    var total_fee = num

    wx.request({
      url: 'https://reader.fuhuideng.com/pay', //仅为示例，并非真实的接口地址
      data: {
        'action': 'like',
        'musicid': id,
        'userid': userid,
        'total_fee': total_fee
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res);
        var paylist = res.data
        console.log(paylist.timeStamp)
        console.log(paylist.nonceStr)
        console.log(paylist.package)
        console.log(paylist.signType)
        console.log(paylist.paySign)

        wx.requestPayment({
          'timeStamp': paylist.timeStamp,
          'nonceStr': paylist.nonceStr,
          'package': paylist.package,
          'signType': paylist.signType,
          'paySign': paylist.paySign,
          'success': function (res) {
            that.setData({
              showrewardList: false,
            })
            console.log("[userid]:" + userid + " [musicid]" + id + "打赏了这个音频")
          },
          'fail': function (res) {

           },
          'complete': function (res) {
              
           }
        })
      }
    })
  },

  showlist: function () {
    this.setData({
      showList: true
    });
    app.slideupshow(this, 'slide_up1', -(height * 0.85), 1);
    setTimeout(function () {
      app.sliderightshow(this, 'slide_left1', 90, 1);
    }.bind(this), 400);
  },

  hidelist: function () {
    this.setData({
      showList: false
    });
    app.slideupshow(this, 'slide_up1', 0, 0);
    app.sliderightshow(this, 'slide_left1', 0, 0.5);
  },




  //生命周期函数--监听页面隐藏
  onHide: function () {
    console.log("页面隐藏");
    this.setData({
      showcolor: false,
    });
  },

  onUnload: function () {
    console.log("页面销毁");
    this.setData({
      showcolor: false,
    });
  },
})