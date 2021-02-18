// pages/category/category.js
import {
  request
} from '../../request/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧构造器
    leftMenuList: [],
    // 右侧构造器
    rightContent: [],
    // 点击切换颜色
    currentIndex: 0,
    // 点击商品菜单的距离
    scrollTop: 0
  },

  // 接口返回的数据
  Cates: [],


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //  1 获取本地存储中的数据  (小程序中也是存在本地存储 技术)
    const Cates = wx.getStorageSync("cates");
    // 2 判断
    if (!Cates) {
      // 不存在  发送请求获取数据
      this.getCates();
    } else {
      // 有旧的数据 定义过期时间  10s 改成 5分钟
      if (Date.now() - Cates.time > 60000 * 5) {
        // 重新发送请求
        this.getCates();
      } else {
        // 可以使用旧的数据
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },

  // 左右侧数据渲染
  async getCates() {
    // 1 使用es7的async await来发送请求
    const res = await request({url: "/categories"});
    // this.Cates = res.data.message;
    this.Cates = res;
    // 把接口的数据存入到本地存储中
    wx.setStorageSync("cates", {data: this.Cates});
    // 构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },

  // 点击切换数据渲染
  handleItemTap(event) {
    const {
      index
    } = event.currentTarget.dataset;

    let rightContent = this.Cates[index].children;
    // 每次点击顶部距离为0
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })
  }



})