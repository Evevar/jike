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

//获取文章列表
function getArticleListApi(params) {
    return request({
        url: '/mp/articles',
        method: 'GET',
        params
    })
}

//更新文章表单
function updateArticleApi(data) {
    return request({
        url: `mp/articles/${data.id}?draft=false`,
        method: 'PUT',
        data
    })
}

//删除文章
function delArticleApi(id) {
    return request({
        url: `/mp/articles/${id}`,
        method: 'DELETE'
    })
}

//获取文章详情
function getArticleByIdApi(id) {
    return request({
        url: `/mp/articles/${id}`,
        method: 'GET'
    })
}


export {
    getArticleListApi,
    getChannelApi,
    createArticleApi,
    delArticleApi,
    getArticleByIdApi,
    updateArticleApi
}