// miniprogram/pages/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: "",
    longitude: "",
    index: 1, //评论和商品的选项卡
    indexTwo: 0, //选择的评论分类
    indexThree: 0, //右侧选择的数据
    show: false, // 遮罩层
    id: '', // 商品id
    tags: [], // 评论分类页面
    scores: [], // 评分页面
    ratings: [], // 评论列表
    menu: [], // 菜单列表
    detail: null // 详情列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
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
      key: 'city',
      success: function(res) {
        vm.setData({
          latitude: res.data.latitude,
          longitude: res.data.longitude
        })
        vm.getDefaultDataList()
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

  },
  /**
   * 获取默认数据列表
   */
  getDefaultDataList: function() {
    const {
      id,
      latitude,
      longitude
    } = this.data
    wx.request({
      url: `https://elm.cangdu.org/ugc/v2/restaurants/${id}/ratings/tags`,
      success: res => {
        this.setData({
          tags: res.data
        })

      }
    })
    wx.request({
      url: `https://elm.cangdu.org/ugc/v2/restaurants/${id}/ratings/scores`,
      success: res => {
        res.data.food_score = res.data.food_score.toFixed(1)
        res.data.overall_score = res.data.overall_score.toFixed(1)
        res.data.service_score = res.data.service_score.toFixed(1)
        res.data.compare_rating = res.data.compare_rating.toFixed(3)
        this.setData({
          scores: res.data
        })
      }
    })
    wx.request({
      url: `https://elm.cangdu.org/shopping/v2/menu?restaurant_id=${id}`,
      success: res => {
        this.setData({
          menu: res.data
        })
      }
    })
    wx.request({
      url: `https://elm.cangdu.org/ugc/v2/restaurants/${id}/ratings?has_content=true&offset=0&limit=10&tag_name=`,
      success: res => {
        var arr = res.data.filter(v => {
          let back = "";
          if (v.avatar.substring(v.avatar.length - 3) == "png") {
            back = "png"
          } else if (v.avatar.substring(v.avatar.length - 4) == "jpeg") {
            back = "jpeg"
          } else {
            return v.avatar = "//elm.cangdu.org/img/default.jpg"
          }
          return v.avatar = "https://fuss10.elemecdn.com/" + v.avatar.substr(0, 1) + "/" + v.avatar.substr(1, 2) + "/" + v.avatar.substr(3) + "." + back
        })
        this.setData({
          ratings: arr
        })
      }
    })
    wx.request({
      url: `https://elm.cangdu.org/shopping/restaurant/${id}?latitude=${latitude}&longitude=${longitude}`,
      success: res => {
        this.setData({
          detail: res.data
        })
      }
    })
  },
  /**
   * 遮罩层显示出来
   */
  changeFooter: function() {
    if (this.data.detail.activities.length === 0) {
      return false;
    }
    this.setData({
      show: true
    })
  },
  /**
   * 关闭遮罩层
   */
  closeZhe: function() {
    this.setData({
      show: false
    })
  },
  /**
   * 选择商品
   */
  xuanShangPin: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      index
    })
  },
  // 选择评论列表
  changeIndexTwo: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      indexTwo: index
    })
  },
  // 选择左侧
  xuanzeLeftContent: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      indexThree: index
    })
  }
})