import {
  chooseAddress, showModal, showToast
} from "../../utils/asyncWx.js";

Page({
  data: {
    // 地址信息
    address: {},
    // 购物车数据
    cart: [],
    // 全选复选框
    allChecked: false,
    // 价格与总价格
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    this.setData({
      address
    });
    // 封装复选框函数调用
    this.setCart(cart);
  },

  // 点击 收货地址
  async handleChooseAddress() {
    try {
      // 1 调用获取收货地址的 api
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;

      // 2 存入到缓存中
      wx.setStorageSync("address", address);

    } catch (error) {
      console.log(error);
    }
  },

  // 复选框选中或不选中 重新计算数量与价格
  handleItemChange(e) {
    // 获取被修改的商品ID
    let goods_id = e.currentTarget.dataset.id
    // 获取购物车数组
    let {
      cart
    } = this.data;
    // 被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 选中状态取反
    cart[index].checked = !cart[index].checked;

    this.setCart(cart);
  },

  // 封装复选框 总价格 总数量状态更新
  setCart(cart) {
    // 计算全选 every 每个回调函数都为true 那么 every方法的返回值为true 
    // const allChecked = cart.length ? cart.every( v => v.checked) : false;
    let allChecked = true;
    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false
      }
    });
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    // 2 给data赋值
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync("cart", cart);
  },

  // 商品全选功能
  handleItemAllCheck(){
    // 1 获取data中的数据
    let {cart, allChecked} = this.data;
    // 2 修改值
    allChecked = !allChecked;
    // 3 循环修改cart数组中的商品选择状态
    cart.forEach( v => v.checked = allChecked);
    // 4 把修改后的值 填充回data或者缓存中
    this.setCart(cart);
  },

  // 商品数量的加减功能
  async handleItemNumEdit(e){
    // 1 获取传递过来的参数
    const {operation, id} = e.currentTarget.dataset;
    // 2 获取购物车数组
    let {cart} = this.data;
    // 3 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 判断是否要执行删除
    if(cart[index].num === 1 && operation === -1){
      // 弹窗提示
      const res = await showModal({content: "您是否要删除?"})
      if(res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    }else{
    // 4 进行修改数量
    cart[index].num += operation;
    // 5 设置回缓存和data中
    this.setCart(cart);
    }
  },

  // 结算功能
  async hendlePay(){
    // 1 判断收货地址
    const {address, totalNum} = this.data;
    if(!address.userName){
      await showToast({title:"您还没有选择收货地址"});
      return;
    }
    // 2 判断用户有没有选购商品
    if(totalNum === 0){
      await showToast({title:"您还没有选购商品"});
      return;
    }
    // 3 跳转到 支付页面
    wx.navigateTo({
      url: '/pages/pay/pay',
    });

  }
})