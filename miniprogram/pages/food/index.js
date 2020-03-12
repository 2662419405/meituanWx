// miniprogram/pages/food/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sortData: [{
        "title": "智能排序",
        "biao": 4,
        "icon": "icon-paixu",
        "color": "59, 135, 200"
      },
      {
        "title": "距离最近",
        "biao": 5,
        "icon": "icon-location",
        "color": "202, 230, 244"
      },
      {
        "title": "销量最高",
        "biao": 6,
        "icon": "icon-icon-test",
        "color": "242, 132, 132"
      },
      {
        "title": "起送价最低",
        "biao": 1,
        "icon": "icon-jiaqian",
        "color": "230, 182, 26"
      },
      {
        "title": "配送速度最快",
        "biao": 2,
        "icon": "icon-shijian",
        "color": "104, 213, 201"
      },
      {
        "title": "评分最高",
        "biao": 3,
        "icon": "icon-wujiaoxingxingxing",
        "color": "251, 238, 218"
      }
    ],
    show: false, // 遮罩层显示
    index: 0, // 头部点击的是哪个选项
    title: "",
    latitude: "",
    longitude: "",
    order_by: 4, //排序方式id： 1：起送价、2：配送速度、3:评分、4: 智能排序(默认)、5:距离最近、6:销量最高
    restaurant_category_id: 0,
    delivery_mode: [], // 配送方式id
    support_ids: [], // 餐馆支持特权的id
    list: [] // 获取到的数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      title: options.title,
      restaurant_category_id: options.restaurant_category_id
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
        vm.getDefaultListData()
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
   * 获取初始数据列表
   */
  getDefaultListData: function() {
    const {
      latitude,
      longitude,
      restaurant_category_id,
      order_by,
      title
    } = this.data;
    wx.request({
      url: `https://elm.cangdu.org/shopping/restaurants?latitude=${latitude}&longitude=${longitude}&offset=0&limit=20&title=${title}&restaurant_category_id=${restaurant_category_id}&order_by=${order_by}`,
      success: res => {
        this.setData({
          list: res.data
        })
      }
    })
  },
  // 选择顶部选项
  showZhe: function(e) {
    const index = e.currentTarget.dataset.index;
    if (index === this.data.index) {
      this.hideZhe()
    } else {
      this.setData({
        index,
        show: true
      })
    }
  },
  // 隐藏遮罩层
  hideZhe: function(e) {
    this.setData({
      index: 0,
      show: false
    })
  },
  //
  xuanzeBiao: function(e) {
    const index = e.currentTarget.dataset.item;
    this.setData({
      order_by: index
    })
    this.getDefaultListData()
  }
})