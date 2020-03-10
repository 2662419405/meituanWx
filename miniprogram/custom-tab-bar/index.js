Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "rgb(255, 196, 93)",
    list: [{
        pagePath: "/pages/index/index",
        iconPath: "/image/home.png",
        selectedIconPath: "/image/home_select.png",
        text: "首页"
      }, {
        pagePath: "/pages/order/index",
        iconPath: "/image/order.png",
        selectedIconPath: "/image/order_select.png",
        text: "订单"
      },
      {
        pagePath: "/pages/my/index",
        iconPath: "/image/my.png",
        selectedIconPath: "/image/my_select.png",
        text: "我的"
      }
    ]
  },
  attached() {},
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({
        url
      })
      console.log(data.index)
      this.setData({
        selected: data.index
      })
    }
  }
})