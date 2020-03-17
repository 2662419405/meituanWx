const app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '',
    latitude: '',
    longitude: '',
    list: [],
    background: [],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    limit: 15,
    offset: 0,
    dingbu: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    qqmapsdk = new QQMapWX({
      key: 'UMHBZ-VA7W3-RMO35-YEJAA-ZF4J7-REFNV' //这里自己的key秘钥进行填充
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    const vm = this
    let query = wx.createSelectorQuery();
    query.select('.shop_list_container').boundingClientRect(function(rect) {
      vm.setData({
        dingbu: rect.bottom + rect.top - 150
      })
    }).exec()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let vm = this;
    //vm.getUserLocation(); // 通过微信的api查询地址
    wx.getStorage({
      key: 'city',
      success: function(res) {
        vm.setData({
          city: res.data.name,
          latitude: res.data.latitude,
          longitude: res.data.longitude
        })
        vm.getDefaultList()
      },
      // 如果没有位置,需要去设置位置
      fail: function(error) {
        wx.navigateTo({
          url: './city/index',
        })
      }
    })
    // 获取轮播图列表
    this.getLunSwiper()
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
  getUserLocation: function() {
    let vm = this;
    wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function(res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function(dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      vm.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          vm.getLocation();
        } else {
          //调用wx.getLocation的API
          vm.getLocation();
        }
      }
    })
  },
  // 微信获得经纬度
  getLocation: function() {
    let vm = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        vm.getLocal(latitude, longitude)
      },
      fail: function(res) {}
    })
  },
  // 获取当前地理位置
  getLocal: function(latitude, longitude) {
    let vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function(res) {
        let city = res.result.ad_info.city
        vm.setData({
          city: city,
          latitude: latitude,
          longitude: longitude
        })

      },
      fail: function(res) {},
      complete: function(res) {}
    });
  },
  // 开始搜索内容
  getSearchValue() {
    wx.switchTab({
      url: '../search/index',
    })
  },
  // 选择城市
  changeCity() {
    wx.navigateTo({
      url: './city/index',
    })
  },
  // 获取数据列表
  getDefaultList: function() {
    var vm = this;
    wx.request({
      url: `https://elm.cangdu.org/shopping/restaurants?latitude=${this.data.latitude}&longitude=${this.data.longitude}&limit=${this.data.limit}&offset=${this.data.offset}`,
      success: res => {
        let newData = this.data.list.concat(res.data)
        vm.setData({
          list: newData
        })
      }
    })
  },
  toSwitchPage: function(e) {
    const obj = e.currentTarget.dataset['item'];
    wx.navigateTo({
      url: `../detail/index?id=${obj.id}`,
    })
  },
  getLunSwiper: function() {
    wx.request({
      url: 'https://elm.cangdu.org/v2/index_entry',
      success: res => {
        const obj = [];
        obj.push({
          list: 1,
          arr: res.data.slice(0, 8)
        }, {
          list: 2,
          arr: res.data.slice(8)
        })
        this.setData({
          background: obj
        })
      }
    })
  },
  switchSwiperOne: function(e) {
    const obj = e.currentTarget.dataset['item'];
    wx.navigateTo({
      url: `../food/index?title=${obj.title}&restaurant_category_id=${obj.id}&geohash=${this.data.latitude},${this.data.longitude}`,
    })
  },
  onPageScroll(e) {
    if (e.scrollTop > this.data.dingbu) {
      // 获取数据
      this.setData({
        offset: this.data.limit + this.data.offset,
        dingbu: this.data.dingbu + this.data.limit * 90
      }, () => {
        this.getDefaultList()
      })
    }
  }
})