export const request = (params) => {
  // 同时发送异步代码的次数
  let ajaxTimes = 0;
  // 定义公共的url
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
  ajaxTimes++;
  // 显示加载中 效果
  wx.showLoading({
    title:"加载中...",
    mask: true
  });


  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result.data.message)
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        ajaxTimes--;
        if(ajaxTimes === 0){
          // 关闭显示加载中效果
          wx.hideLoading();
        }
      }
    })
  })
}