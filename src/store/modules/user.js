//和用户有关的状态管理
import { createSlice } from "@reduxjs/toolkit";
import { setToken as _setToken, getToken, clearToken } from "@/utils";
import { loginApi, getProfileApi } from '@/apis/user'

const userStore = createSlice({
    name: 'user',
    // 数据状态
    initialState: {
        token: getToken() || '',
        userInfo: {}
    },
    // 同步修改方法
    reducers: {
        setToken(state, action) {
            state.token = action.payload
            //localstorage也要存一份用来持久化
            _setToken(action.payload)
        },
        setUserInfo(state, action) {
            state.userInfo = action.payload
        },
        clearUserInfo(state) {
            state.token = ''
            state.userInfo = {}
            clearToken()
        }
    }
})



//解构出actionCreater

const { clearUserInfo, setToken, setUserInfo } = userStore.actions

//获取reducer函数

const userReducer = userStore.reducer

//编写异步方法 完成登录获取Token
const fetchLogin = (loginForm) => {
    return async (dispatch) => {
        //1.发送异步请求 
        const res = await loginApi(loginForm)
        //2.提交同步action进行token存入
        dispatch(setToken(res.data.token))
    }
}

//获取个人用户信息
const fetchUserInfo = () => {
    return async (dispatch) => {
        const res = await getProfileApi()
        dispatch(setUserInfo(res.data))
    }
}


export { fetchUserInfo, fetchLogin, setToken, clearUserInfo }

export default userReducer