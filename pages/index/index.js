import {
  request
} from '../../request/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [], //初始化轮播图数据
    catesList: [], //初始化导航数据
    floorList: [] //初始化楼层数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getSwiperList();
    this.getCartList();
    this.getfloorList();
  },

  // 轮播图请求数据
  getSwiperList() {
    request({
        url: '/home/swiperdata'
      })
      .then(result => {
        this.setData({
          swiperList: result
        })
      })
  },

  // 导航请求数据
  getCartList() {
    request({
        url: '/home/catitems'
      })
      .then(result => {
        this.setData({
          catesList: result
        })
      })
  },

  // 楼层请求数据
  getfloorList() {
    request({ url: '/home/floordata'})
    .then(result => {
      let data =JSON.stringify(result);
      let data1=data.replace(/goods_list/g, 'goods_list/goods_list')
      let data2=JSON.parse(data1)
      this.setData({
        floorList:data2,
      })
    })
  }


})