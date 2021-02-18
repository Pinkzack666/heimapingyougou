import { request } from '../../request/request';
Page({

  data: {
    // 搜索数据初始化
    goods:[],
    // 按钮显示
    isFocus: false,
    // 取消
    inpValue: ""
  },

  // 定时器
  TimeId: -1,
  // 输入框的值改变 就会触发该事件
  handleInput(e){
    // 1 获取输入框的值
    const {value} = e.detail;
    // 2 检测合法性 trim清除空格符串
    if(!value.trim()){
      this.setData({
        goods: [],
        isFocus: false
      })
      clearTimeout(this.TimeId)
      // 值不合法
      return;
    }

    // 3 准备发送请求获取数据
    this.setData({
      isFocus: true
    })
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout( () => {
      this.qSearch(value);
    }, 1000)
  },

  // 请求获取搜索数据 
  async qSearch(query){
    const goods = await request({url:"/goods/qsearch", data: {query}})
    this.setData({
      goods
    })
  },

  // 点击 取消 进行清空
  handleCancel(){
    this.setData({
      inpValue: "",
      isFocus: false,
      goods: []
    })
  }
})