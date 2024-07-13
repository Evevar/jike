//axios封装处理
import axios from "axios";
import { clearToken, getToken } from "./token";
import router from "@/router";
//1.根域名
//2.超时时间
//3.请求拦截器和响应拦截器

const request = axios.create({
    baseURL: 'http://geek.itheima.net/v1_0',
    timeout: 20000
})

// 添加请求拦截器
request.interceptors.request.use((config) => {
    // 在发送请求之前做些自定义的配置参数处理
    //操作config获取token
    //1.获取到token
    //2.按照后端格式对token进行拼接
    const token = getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use((response) => {
    // 对响应数据做什么   处理返回数据
    return response.data;
}, function (error) {
    //超出2xx范围触发
    // 对响应错误做点什么
    //监控401 token失效
    console.dir(error)
    if (error.response.status === 401) {
        clearToken()
        router.navigate('/login').then(() => {
            window.location.reload()
        })
    }
    return Promise.reject(error);
});

export { request }