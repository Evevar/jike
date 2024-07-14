//封装文章相关接口函数

import { request } from "@/utils";

//获取频道列表
function getChannelApi() {
    return request({
        url: '/channels',
        method: 'GET'
    })
}

//提交文章列表
function createArticleApi(data) {
    return request({
        url: '/mp/articles?draft=false',
        method: 'POST',
        data
    })
}


export { getChannelApi, createArticleApi }