import http from './../../../base/api/public'
import querystring from 'querystring'

let sysConfig = require('@/../config/sysConfig')
let apiUrl = sysConfig.xcApiUrlPre;

/*页面列表*/
export const media_list = (page, size, params) => {
  //params为json格式
  //使用querystring将json对象转成key/value串
  let querys = querystring.stringify(params)
  return http.requestQuickGet(apiUrl + '/media/file/list/' + page + '/' + size + '/?' + querys)
}
/*发送处理消息*/
export const media_process = (mediaId) => {
  return http.requestPost(apiUrl + '/media/upload/process/' + mediaId)
}
/*删除媒资信息*/
export const delete_media = (mediaId) => {
  return http.requestDelete(apiUrl + '/media/file/delete/' + mediaId)
}
/*删除媒资信息*/
export const get_player_url = (mediaId) => {
  return http.requestQuickGet(apiUrl + '/media/file/get/' + mediaId)
}
