// miniprogram/pages/my/service/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    explain: []
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
    wx.request({
      url: 'https://elm.cangdu.org/v3/profile/explain',
      success: res => {
        let arr = []
        for (let index in res.data) {
          if (res.data[index].length < 10 && !res.data[index].startsWith("#")) {
            arr.push(res.data[index])
          }
        }
        this.setData({
          explain: arr
        })
      }
    })
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

  }
})