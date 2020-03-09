const app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    province: '',
    city: '',
    latitude: '',
    longitude: '',
    background: [{
      list: 1,
      arr: [{
          title: "喂奶枕",
          url: "icon-weinaizhen",
          bg: "#fd9d21",
        }, {
          title: "婴儿车",
          url: "icon-yingerche",
          bg: "#ff6767",
        },
        {
          title: "婴儿床",
          url: "icon-yingerchuang",
          bg: "#8a90fa",
        }, {
          title: "纸巾",
          url: "icon-zhijin",
          bg: "#fed030",
        },
        {
          title: "鞋子",
          url: "icon-xiezi",
          bg: "#fd9d21",
        }, {
          title: "衣服",
          url: "icon-yifu",
          bg: "#fed030",
        },
        {
          title: "手套",
          url: "icon-shoutao",
          bg: "#4dc6ee",
        }, {
          title: "口水兜",
          url: "icon-koushuidou",
          bg: "#ff80c2",
        },
        {
          title: "袜子",
          url: "icon-wazi",
          bg: "#fd9d21",
        }, {
          title: "玩具",
          url: "icon-wanju",
          bg: "#A8DD99",
        }
      ],
    }, {
      list: 1,
      arr: [{
          title: "奶嘴",
          url: "icon-naizui",
        bg: "#fd9d21",
        }, {
          title: "奶瓶",
          url: "icon-naiping",
          bg: "#ff6767",
        },
        {
          title: "连体衣",
          url: "icon-liantiyi",
          bg: "#8a90fa",
        }, {
          title: "内裤",
          url: "icon-neiku",
          bg: "#fed030",
        },
        {
          title: "毛巾",
          url: "icon-maojin",
          bg: "#fd9d21",
        }, {
          title: "帽子",
          url: "icon-maozi",
          bg: "#fed030",
        },
        {
          title: "裤子",
          url: "icon-kuzi",
          bg: "#4dc6ee",
        }, {
          title: "布袋",
          url: "icon-fanbudai",
          bg: "#ff80c2",
        }, {
          title: "礼物",
          url: "icon-liwu",
          bg: "#fd9d21",
        }, {
          title: "背心",
          url: "icon-beixin",
          bg: "#A8DD99",
        }
      ]
    }],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    qqmapsdk = new QQMapWX({
      key: 'UMHBZ-VA7W3-RMO35-YEJAA-ZF4J7-REFNV' //这里自己的key秘钥进行填充
    });
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
    let vm = this;
    vm.getUserLocation();
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
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        vm.setData({
          province: province,
          city: city,
          latitude: latitude,
          longitude: longitude
        })

      },
      fail: function(res) {},
      complete: function(res) {
        // console.log(res);
      }
    });
  },
  // 开始搜索内容
  getSearchValue() {
    wx.navigateTo({
      url: './search/index',
    })
  }
})