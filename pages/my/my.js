var app = getApp();
Page({
  data: {
    login: true,
    nickName: '',
    avatarUrl: '',
    gender: 0,
  },

  onShow: function () {
    var that = this;
    var nickName = ''
    var avatarUrl = ''
    var gender = ''
    var province = ''
    var city = ''
    var country = ''
    var userid = wx.getStorageSync('userid')

    console.log("userid"+userid)
  
    if(userid!=""&&userid!=null){
      var that = this;
      var nickName = ''
      var avatarUrl = ''
      var gender = ''
      var province = ''
      var city = ''
      var country = ''
      var province = ''
      //记录登录事件，并获取用户的信息
      wx.request({
        url: 'https://reader.fuhuideng.com/login',
        //url:'http://127.0.0.1:8080/reade_fhd/login',
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
          if (user != "" && user != null && user != undefined){
            that.setData({
              login: true,
              nickName: user.val3,
              avatarUrl: user.val4,
              gender: user.val5
            })
            //存用户信息到全局变量
            app.globalData.userid = userid
            console.log("登录成功" + userid)
          }else{
            console.log(333, '执行到这里，说明登录失败')
            that.setData({
              login: false,
              nickName: '请登录',
            })

            wx.setStorageSync('userid', "")
          }
        },
        fail: function (res) {
          console.log(333, '执行到这里，说明登录失败')
          wx.showToast({
            title: "登录失败请重新授权",
            icon: 'none',
            duration: 2000
          });
          that.setData({
            login: false,
            nickName: '请登录',
          })
        }
      })
    }else{
      that.setData({
        login: false,
        nickName: '请登录',
      })
    }
  },

  gotoPage: function (event) {
    const number = event.currentTarget.id//1或者2得到点击了按钮1或者按钮2 
    const url = "/pages/mainpages" + number + "/mainpages" + number;//得到页面url 
    console.log(number);
    wx.navigateTo({
      url: url,
    })
  },

  onGotUserInfo: function (e) {
    var that = this;
    var nickName = ''
    var avatarUrl = ''
    var gender = ''
    var province = ''
    var city = ''
    var country = ''
    var province = ''


    if (e.detail.userInfo) {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      wx.getUserInfo({
        success: function (res) {
          var userInfo = res.userInfo
          nickName = userInfo.nickName
          avatarUrl = userInfo.avatarUrl
          gender = userInfo.gender //性别 0：未知、1：男、2：女
          province = userInfo.province//
          city = userInfo.city
          country = userInfo.country

          wx.login({
            success: res => {
              console.log(res.code)
              wx.request({
                //后台接口地址
                url: 'https://reader.fuhuideng.com/reg',
                data: {
                  code: res.code,
                  'nickName': nickName,
                  'avatarUrl': avatarUrl,
                  'gender': gender,
                  'province': province,
                  'city': city,
                  'country': country
                },
                method: 'GET',
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  //再登录一下更新一下性别和头像
                  console.log('测试serid:' + res.data);
                  wx.request({
                    url: 'https://reader.fuhuideng.com/login',
                    data: {
                      'action': 'login',
                      'userid': res.data,
                    },
                    header: {
                      'content-type': 'application/json' // 默认值
                    },
                    success: function (res) {
                      var user = res.data
                      console.log(user)
                      that.setData({
                        login: true,
                        nickName: user.val3,
                        avatarUrl: user.val4,
                        gender: user.val5
                      })
                      //存用户信息到全局变量
                      //
                      wx.setStorageSync('userid', user.val1)
                      app.globalData.userid = user.val1
                      console.log("登录成功:" + user.val1)
                    },
                    fail: function (res) {
                      console.log(333, '执行到这里，说明登录失败')
                      wx.showToast({
                        title: "登录失败",
                        icon: 'none',
                        duration: 2000
                      });
                      that.setData({
                        login: false,
                        nickName: '请登录',
                      })
                    }
                  })
                  //登录完成
                }
              })
            }
          })
        }
      })
    } else {
      console.log(333, '执行到这里，说明拒绝了授权')
      wx.showToast({
        title: "为了您更好的体验,请先同意授权",
        icon: 'none',
        duration: 2000
      });
    }
  }

})
