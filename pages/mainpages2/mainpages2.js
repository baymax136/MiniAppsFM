// pages/mainpages2/mainpages2.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    num: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that = this
    var userid = wx.getStorageSync('userid')

    console.log("[userid]:" + userid + "加载喜欢音频列表")

    wx.request({
      url: 'https://reader.fuhuideng.com/history',
      data: {
        'action': 'historylist',
        'userid': userid
      },
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
        // console.log(listnum);
        that.setData({
          num: listnum
        })
      }
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