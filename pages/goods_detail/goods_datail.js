import { request } from '../../request/request';
Page({
  data: {
    // 商品详情数据
    goodsObj:{},
    // 收藏
    isCollect: false,
  },

  // 商品对象
  GoodsInfo: {},

  //  * 生命周期函数--监听页面加载
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;

    const {goods_id} = options;
    this.getGoodsDatail(goods_id);


    // 以下是立即购买代码
  },


  // 商品详情数据
  async getGoodsDatail(goods_id){
    const goodsObj = await request({url:"/goods/detail",data:{goods_id}});
    // 赋值到商品对象
    this.GoodsInfo = goodsObj;
    // 1 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    // 2 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);

    this.setData({
      goodsObj:{
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // 修改图片的格式 方法 1、找后台改 2、自己修改
        // goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        goods_introduce: goodsObj.goods_introduce,
        pics: goodsObj.pics
      },
      isCollect
    })
  },

  // 点击轮播图 放大预览
  handlePrevewImage(e){
    // 1、先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    // 2、接收传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    })
  },

  // 点击 加入购物车
  handleCartAdd(){
    // 1、获取缓存中的购物车 数组
    let cart = wx.getStorageSync("cart") || [];
    // 2、判断 商品对象是否存在于购物车数组中
    let index = cart.findIndex( v => v.goods_id === this.GoodsInfo.goods_id);
    if(index === -1){
      // 3、不存在 第一次条件
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push( this.GoodsInfo);
    }else{
      // 4、已经存在购物车数据 执行 num++
      cart[index].num++;
    }
    // 5、把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);

    // 6、弹窗显示
    wx.showToast({
      title: '添加购物车成功',
      icon: 'success',
      mask: true
    });
  },

  // 点击 收藏商品
  handleCollect(){  
    let isCollect = false;
    // 1 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    // 2 判断该商品是否被收藏过
    let index = collect.findIndex( v => v.goods_id === this.GoodsInfo.goods_id);
    // 3 当index ！= -1 表示 已经收藏
    if( index !== -1){
      // 能找到 已经收藏过了 在数组中收藏该商品
      collect.splice(index,1);
      isCollect = false;
      wx.showToast({
        title: '取消收藏成功',
        icon: 'success',
        mask: true
      });
    }else {
      // 没有收藏
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    // 4 把数组存入到缓存中
    wx.setStorageSync("collect", collect);
    // 5 修改data中的属性 iscollect
    this.setData({
      isCollect
    })

  },

 
})