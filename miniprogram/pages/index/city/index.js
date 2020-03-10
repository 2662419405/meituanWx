// miniprogram/pages/index/city/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hot: [],
    group: []
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
    wx.request({
      url: "https://elm.cangdu.org/v1/cities?type=hot",
      success: res => {
        this.setData({
          hot: res.data
        })
      }
    });
    wx.request({
      url: "https://elm.cangdu.org/v1/cities?type=group",
      success: res => {
        const ordered = {};
        Object.keys(res.data).sort().forEach(function(key) {
          ordered[key] = res.data[key];
        });
        this.setData({
          group: ordered
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

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
  switchCity: function(e) {
    let query = e.currentTarget.dataset['item'];
    // 跳转路由
    let id = query.id
    wx.navigateTo({
      url: './change?id=' + id + "&name=" + query.name,
    })
  }
})