// pages/feedback/feedback.js
import {showToast} from "../../utils/asyncWx"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        value: '体验问题',
        isActive: true
      },
      {
        id: 1,
        value: '商品、商家投诉',
        isActive: false
      },
    ],
    // 初始化照片为空
    chooseImgs: [],
    // 文本域的内容
    textVal: ""
  },
  // 外网的图片的路径数组
  UpLoadImgs: [],

  handleTabsItemChange(e) {
    // 获取被点击的标题索引
    const {
      index
    } = e.detail;
    // 修改源数组
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 赋值到data中
    this.setData({
      tabs
    })
  },

  // 添加图片
  handleChooseImg() {
    // 调用小程序内置的选择图片api
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          // 图片数组 进行拼接
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      },
    });

  },

  // 删除图片
  handleRemoveImg(e) {
    // 获取被点击的组件的索引 
    const {
      index
    } = e.currentTarget.dataset;
    // console.log(index);
    // 获取data中的图片数组
    let {
      chooseImgs
    } = this.data;
    // 删除元素
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    })
  },

  // 获取文本
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  // 提交数据
  handleFormSubmit() {
    showToast({title:"此功能暂时不开放!"})
  }
})