import './index.scss'
import { Card, Form, Input, Button, message } from 'antd'
import logo from '@/assets/logo.png'
import { useDispatch } from 'react-redux'
import { fetchLogin } from '@/store/modules/user'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const onFinish = async (values) => {
        console.log(values)
        //触发异步action fetchLogin
        await dispatch(fetchLogin(values))
        //1.跳转到首页
        navigate('/')
        //2.提示用户
        message.success('登陆成功')
    }
    return (
        <div className="login">
            <Card className="login-container" validateTrigger={['onBlur']}>
                <img className="login-logo" src={logo} alt="" />
                {/* 登录表单 */}
                <Form onFinish={onFinish}>
                    <Form.Item
                        name="mobile"
                        rules={[
                            {
                                required: true,
                                message: '请输入手机号',
                            },
                            //多条效验模式
                            {
                                pattern: /^1[3-9]\d{9}$/,
                                message: '手机号码格式不正确',
                            }
                        ]}
                    >
                        <Input size="large" placeholder="请输入手机号" />
                    </Form.Item>
                    <Form.Item
                        name="code"
                        rules={[
                            {
                                required: true,
                                message: '请输入验证码',
                            },
                        ]}>
                        <Input size="large" placeholder="请输入验证码" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default Login