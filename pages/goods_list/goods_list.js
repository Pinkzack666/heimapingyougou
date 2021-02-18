import { request } from '../../request/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      },
    ],
    // 商品列表数据
    goodsList:[]
  },
  // 接口要的参数
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },
  // 全局的总条数
  totalPages: 1,

  //  * 生命周期函数--监听页面加载
  onLoad: function (options) {
    this.QueryParams.cid = options.cid || "";
    this.QueryParams.query = options.query || "";
    this.getGoodsList();
  },

  // 获取商品列表数据
  async getGoodsList(){
    const res=await request({url:"/goods/search",data:this.QueryParams});
    // 获取 总条数
    const total = res.total
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    this.setData({
      // 拼接了数组
      goodsList:[...this.data.goodsList, ...res.goods]
    })

    // 请求成功时 关闭下拉刷新
    wx.stopPullDownRefresh();
  },

  // 标题点击事件 从子组件传递过来
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

  // 页面上滑 滚动条触底事件
  onReachBottom(){
    // 判断还有没有下一页数据
    if(this.QueryParams.pagenum >= this.totalPages){

   
    }else{
      //还有下一页数据
      this.QueryParams.pagenum++;
      this.getGoodsList();
      wx.showToast({
        title: '数据加载中...',
        icon: 'loading',
        duration: 500
      })
    }
  },

  // 监听下拉刷新
  onPullDownRefresh(){
    //1、重置数组
    this.setData({
      goodsList: []
    });
    //2、重置页码
    this.QueryParams.pagenum = 1;
    //3、发送请求
    this.getGoodsList()
  }
})