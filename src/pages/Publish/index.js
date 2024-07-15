import {
    Card,
    Breadcrumb,
    Form,
    Button,
    Radio,
    Input,
    Upload,
    Space,
    Select,
    message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useSearchParams } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useEffect, useState } from 'react'
import { createArticleApi, getArticleByIdApi, updateArticleApi } from '@/apis/article'
import { useChannel } from '@/hooks/useChannel'

const { Option } = Select

const Publish = () => {
    //获取频道列表
    const { channelList } = useChannel()
    //提交表单
    const onFinish = async (formValue) => {
        console.log(formValue)
        //效验封面类型imageType是否和实际的图片列表imageList数量相等
        if (imageList.length !== imageType) return message.warning('封面类型和图片数量不匹配')
        const { title, content, channel_id } = formValue
        //按照接口文档处理收集到的表单数据
        const reqData = {
            title,
            content,
            cover: {
                type: imageType,
                //这里的url只是新增的时候的逻辑
                //这时候要做编辑的逻辑处理
                images: imageList.map(item => {
                    if (item.response) {
                        return item.response.data.url
                    } else {
                        return item.url
                    }
                })
            },
            channel_id
        }
        //调用接口提交
        //根据不同状态调用不同接口
        if (articleId) {
            //更新接口
            await updateArticleApi({ ...reqData, id: articleId })
        } else {
            await createArticleApi(reqData)
        }

        message.success(`${articleId ? '编辑' : '发布'}文章成功`)
    }
    //上传回调
    const [imageList, setImageList] = useState([])
    const onChange = (value) => {
        console.log('上传中', value)
        setImageList(value.fileList)
    }
    //切换图片封装类型
    const [imageType, setImageType] = useState(0)
    const onTypeChange = (e) => {

        setImageType(e.target.value)

    }
    //回填数据
    const [searchParams] = useSearchParams()
    const articleId = searchParams.get('id')
    //获取实例
    const [form] = Form.useForm()
    useEffect(() => {
        //1.通过id获取数据
        async function getArticleDetail() {
            const res = await getArticleByIdApi(articleId)
            const data = res.data
            const { cover } = data
            form.setFieldsValue({
                ...data,
                type: cover.type
            })
            //数据结构类型不同  需要重新使用set方法
            //回填图片列表
            setImageType(cover.type)
            //显示图片
            setImageList(cover.images.map(url => {
                return { url }
            }))
        }
        //只有有id才能调用此函数
        if (articleId) {
            //2.调用实例方法 完成回填
            getArticleDetail()
        }


    }, [articleId, form])
    return (
        <div className="publish">
            <Card
                title={
                    <Breadcrumb items={[
                        { title: <Link to={'/'}>首页</Link> },
                        { title: `${articleId ? '编辑文章' : '发布文章'}` },
                    ]}
                    />
                }
            >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ type: 0 }}
                    onFinish={onFinish}
                    form={form}
                >
                    <Form.Item
                        label="标题"
                        name="title"
                        rules={[{ required: true, message: '请输入文章标题' }]}
                    >
                        <Input placeholder="请输入文章标题" style={{ width: 400 }} />
                    </Form.Item>
                    <Form.Item
                        label="频道"
                        name="channel_id"
                        rules={[{ required: true, message: '请选择文章频道' }]}
                    >
                        <Select placeholder="请选择文章频道" style={{ width: 400 }}>
                            {/* value属性用户选定后会自动收集起来作为接口提交给后端 */}
                            {channelList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item label="封面">
                        <Form.Item name="type">
                            <Radio.Group onChange={onTypeChange}>
                                <Radio value={1}>单图</Radio>
                                <Radio value={3}>三图</Radio>
                                <Radio value={0}>无图</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {/* listType决定选择文件框的外观样式
                            shouUploadList:控制显示上传列表 */}
                        {imageType > 0 && <Upload
                            listType="picture-card"
                            showUploadList
                            action={'http://geek.itheima.net/v1_0/upload'}
                            name='image'
                            multiple={imageType > 1}
                            onChange={onChange}
                            maxCount={imageType}
                            fileList={imageList}
                        >

                            {imageList.length >= imageType ? null : <PlusOutlined style={{ marginTop: 8 }} />}

                        </Upload>}

                    </Form.Item>
                    <Form.Item
                        label="内容"
                        name="content"
                        rules={[{ required: true, message: '请输入文章内容' }]}
                    >
                        {/* 副文本编辑器 */}
                        <ReactQuill
                            className="publish-quill"
                            theme="snow"
                            placeholder="请输入文章内容"
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 4 }}>
                        <Space>
                            <Button size="large" type="primary" htmlType="submit">
                                {articleId ? '更新文章' : '发布文章'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default Publish