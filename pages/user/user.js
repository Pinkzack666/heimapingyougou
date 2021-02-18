// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户信息
    userInfo:{}, 
    // 用户收藏商品数量
    collectNum: 0
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取用户信息
    const userInfo = wx.getStorageSync("userInfo");
    // 获取收藏数量
    const collect = wx.getStorageSync("collect") || [];
    this.setData({
      userInfo,
      collectNum: collect.length
    })
  },


  // 获取登录信息
  handleGetUserInfo(e){
    const {userInfo} = e.detail;
    wx.setStorageSync("userInfo", userInfo);
    this.setData({
      userInfo
    })
  }
  
})