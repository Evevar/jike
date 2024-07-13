//封装高阶组件
//有token正常跳转，没有就去登录
import { getToken } from "@/utils"
import { Navigate } from "react-router-dom"
const AuthRoute = ({ children }) => {
    const token = getToken()
    if (token) {
        return <>{children}</>
    } else {
        return <Navigate to="/login" replace />
    }
}

export default AuthRoute