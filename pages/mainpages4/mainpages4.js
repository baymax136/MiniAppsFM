// pages/mainpages4/mainpages4.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showList: false,
    num:'',
  },

  onShow: function () {
    var listnum = [];
    for (var i = 1; i <= 54; ++i) {
      listnum = listnum.concat(i);
    }
    this.setData({
      num: listnum
    });
  },


  gotoPage: function (event) {
    const number = event.currentTarget.id//1或者2得到点击了按钮1或者按钮2 
    var that = this;
    // console.log(number);
    if (number == 2) {
      wx.showActionSheet({
        itemList: ['男', '女', '隐藏'],
        success: function (res) {
          console.log(res.tapIndex)
          if (res.tapIndex == 0) {
            console.log("选择了男");
            //更改性别
            that.changeSex(1);
            //清除登录状态
            that.removeUser();
          } else if (res.tapIndex == 1) {
            console.log("选择了女");
            //更改性别
            that.changeSex(2);
            //清除登录状态
            that.removeUser();
          } else if (res.tapIndex == 2) {
            console.log("选择了隐藏");
            //更改性别
            that.changeSex(0);
            //清除登录状态
            that.removeUser();
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    } else if (number == 1) {
      wx.showActionSheet({
        itemList: ['选择头像', '使用我的微信头像'],
        success: function (res) {
          console.log(res.tapIndex)
          if (res.tapIndex == 0) {
            console.log("选择了选择头像");
            that.showlist();
          } else if (res.tapIndex == 1) {
            console.log("选择了使用我的微信头像");
            that.changeAvatarUrl("");
            //清除登录状态
            that.removeUser();
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    }
  },

  changeSex: function (event) {
    var that = this//不要漏了这句，很重要
    var userid = wx.getStorageSync('userid')
    console.log(event);

    if (userid != "") {
      console.log(userid);
      wx.request({
        url: 'https://reader.fuhuideng.com/setting', 
        data: {
          'sex': event,
          'userid': userid,
          'action': 'changeSex'
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data);
        }
      })
    }
  },

  getavatarUrl: function (event) {
    const number = event.currentTarget.id//1或者2得到点击了按钮1或者按钮2 
    var that = this;
    console.log(number);

    wx.showModal({
      title: '提示',
      content: '您确定更换为这个头像吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.changeAvatarUrl("http://cdn.fuhuideng.com/head_image/head_image" + number +"@3x.png")
          wx.showToast({
            title: '成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
          //清除登录状态
          that.removeUser();
        } else {
          console.log('用户点击取消')
        }
      }
    })
  },

  showlist: function () {
    this.setData({
      showList: true
    });
  },

  closelist: function(){
    this.setData({
      showList: false
    });
  },


  changeAvatarUrl: function (event) {
    var that = this//不要漏了这句，很重要
    var userid = wx.getStorageSync('userid')
    console.log(event);

    if (userid != "") {
      console.log(userid);
      wx.request({
        url: 'https://reader.fuhuideng.com/setting', 
        data: {
          'avatarUrl': event,
          'userid': userid,
          'action': 'changeAvatarUrl'
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data);
        }
      })
    }
  },


  removeUser: function () {
    wx.removeStorage({
      key: 'userid',
      success(res) {
        console.log(res)
        wx.switchTab({
          url: "/pages/my/my",
        })
      }
    })
  },
})