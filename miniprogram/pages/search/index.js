// miniprogram/pages/search/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: "",
    longitude: "",
    history: [],
    list: [],
    value: "",
    message: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var vm = this;
    wx.getStorage({
      key: 'history',
      success: res => {
        this.setData({
          history: res.data
        })
      },
    })
    wx.getStorage({
      key: 'city',
      success: function(res) {
        vm.setData({
          latitude: res.data.latitude,
          longitude: res.data.longitude
        })
      },
      // 如果没有位置,需要去设置位置
      fail: function(error) {
        wx.navigateTo({
          url: './city/index',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      list: [],
      value: "",
      message: ""
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 输入搜索内容
  changeKey: function(e) {
    this.setData({
      value: e.detail.value
    })
  },
  submitKeyWord: function() {
    if (this.data.value.length == 0) {
      return false;
    }
    // 存储历史记录
    const arr = wx.getStorageSync('history');
    if (arr.indexOf(this.data.value) === -1) { //去掉重复记录
      wx.setStorageSync('history', [...arr, this.data.value]);
    }
    // 获取数据
    wx.request({
      url: `https://elm.cangdu.org/v4/restaurants?geohash=${this.data.latitude},${this.data.longitude}&keyword=${this.data.value}`,
      success: res => {
        if (res.data.status == 0) {
          this.setData({
            message: res.data.message
          })
        } else {
          this.setData({
            list: res.data,
            message: ""
          })
        }
      }
    })
  },
  // 跳转到具体商家
  switchOne: function(e) {
    const obj = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `../detail/index?id=${obj.id}`,
    })
  },
  // 清除记录缓存
  clearStorageBtn: function(e) {
    wx.removeStorage({
      key: 'history',
      success: res => {
        this.setData({
          history: []
        })
      },
    })
  },
  // 清除某个的数据缓存
  clearHuanCun(e) {
    const index = e.currentTarget.dataset.index;
    const arr = this.data.history
    arr.splice(index, 1);
    this.setData({
      history: arr
    })
    wx.setStorage({
      key: 'history',
      data: arr,
    })
  },
  // 直接进入搜索状态
  xuanzeHistory(e) {
    const obj = e.currentTarget.dataset.item;
    this.setData({
      value: obj
    })
    this.submitKeyWord()
  }
})