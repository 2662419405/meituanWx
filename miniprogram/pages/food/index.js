// miniprogram/pages/food/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_attributes: [], //商家活动
    xianPei: false, //配送方式是否选中
    delivery_modes: [{
      "color": "57A9FF",
      "id": 1,
      "is_solid": true,
      "text": "蜂鸟专送"
    }], // 配送方式
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
    indexTwo: -1,
    indexThree: -1,
    shu: 0,
    meishiDetail: null,
    title: "",
    latitude: "",
    longitude: "",
    order_by: 4, //排序方式id： 1：起送价、2：配送速度、3:评分、4: 智能排序(默认)、5:距离最近、6:销量最高
    restaurant_category_id: 0,
    restaurant_category_ids: null, //选中的美食列表
    category: [], // 渲染的美食列表
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
        vm.getListTopData()
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
      restaurant_category_ids,
      order_by,
      activity_attributes,
      support_ids,
      title
    } = this.data;
    let restaurant;
    // 获取美食列表
    if (restaurant_category_ids) {
      restaurant = `restaurant_category_id=&restaurant_category_ids[]=${restaurant_category_ids}`;
    } else {
      restaurant = `restaurant_category_id=${restaurant_category_id}`;
    }
    // 获取筛选列表
    let shai = "";
    support_ids.forEach((item, index) => {
      if (item === true) {
        shai += "&support_ids[]=" + activity_attributes[index].id;
      }
    })
    wx.request({
      url: `https://elm.cangdu.org/shopping/restaurants?latitude=${latitude}&longitude=${longitude}&offset=0&limit=20&title=${title}&${restaurant}&order_by=${order_by}${shai}`,
      success: res => {
        this.setData({
          list: res.data
        })
        this.hideZhe()
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
    this.hideZhe()
  },
  /**
   * 获取配送方式和活动数据列表
   */
  getListTopData: function() {
    const {
      latitude,
      longitude,
    } = this.data;
    wx.request({
      url: `https://elm.cangdu.org/shopping/v1/restaurants/activity_attributes?latitude=${latitude}&longitude=${longitude}`,
      success: res => {
        this.setData({
          activity_attributes: res.data
        })
      }
    })
    wx.request({
      url: `https://elm.cangdu.org/shopping/v2/restaurant/category?latitude=${latitude}&longitude=${longitude}`,
      success: res => {
        var arr = res.data.filter(v => {
          let back = "";
          if (v.image_url.substring(v.image_url.length - 3) == "png") {
            back = "png"
          } else if (v.image_url.substring(v.image_url.length - 4) == "jpeg") {
            back = "jpeg"
          } else {
            return v.image_url = "//elm.cangdu.org/img/default.jpg"
          }
          return v.image_url = "https://fuss10.elemecdn.com/" + v.image_url.substr(0, 1) + "/" + v.image_url.substr(1, 2) + "/" + v.image_url.substr(3) + "." + back
        })
        this.setData({
          category: arr
        })
      }
    })
  },
  // 选择配送
  swtichPeiSongFang: function() {
    if (!this.data.xianPei) {
      this.setData({
        xianPei: !this.data.xianPei,
        delivery_mode: [1]
      })
    } else {
      this.setData({
        xianPei: !this.data.xianPei,
        delivery_mode: []
      })
    }
  },
  //清空筛选
  clearShaiXuan: function() {
    this.setData({
      xianPei: false,
      delivery_mode: [],
      support_ids: [],
      shu: 0
    })
  },
  /**
   * 选择商家属性
   */
  xuanzeShuxing: function(e) {
    const index = e.currentTarget.dataset.item;
    const suo = e.currentTarget.dataset.index;
    const dataArr = this.data.support_ids;
    // 存在就移除,不存在就增加
    if (dataArr[suo] === true) {
      dataArr[suo] = false
    } else {
      dataArr[suo] = true
    }
    let shu = this.data.support_ids.filter(i => {
      return i === true
    }).length
    this.setData({
      support_ids: dataArr,
      shu
    })
  },
  /**
   * 选择导出二级菜单
   */
  swtichMeiShiList: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      indexTwo: index,
      indexThree: -1
    })
  },
  /**
   * 选择具体的某个美食
   */
  swtichMeiShiDetail: function(e) {
    const item = e.currentTarget.dataset.i;
    const index = e.currentTarget.dataset.index;
    this.setData({
      indexThree: index,
      restaurant_category_ids: item
    })
    this.getDefaultListData()
    this.hideZhe()
  },
  /**
   * 发送具体数据
   */
  fasongData: function() {
    this.getDefaultListData()
    this.hideZhe()
  }
})