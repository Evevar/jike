import { Link, useNavigate } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select, Popconfirm } from 'antd'
//引入汉化包 时间选择器显示中文
import locale from 'antd/es/date-picker/locale/zh_CN'


//导入资源
import { Table, Tag, Space } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import img404 from '@/assets/error.png'
import { useChannel } from '@/hooks/useChannel'
import { getArticleListApi, delArticleApi } from '@/apis/article'
import { useEffect, useState } from 'react'

const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
    const navigate = useNavigate()
    //获取频道列表
    const { channelList } = useChannel()
    // 准备列数据
    //定义状态枚举
    const status = {
        1: <Tag color="warning">待审核</Tag>,
        2: <Tag color="success">审核通过</Tag>
    }
    const columns = [
        {
            title: '封面',
            dataIndex: 'cover',
            width: 120,
            render: cover => {
                return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
            }
        },
        {
            title: '标题',
            dataIndex: 'title',
            width: 220
        },
        {
            title: '状态',
            dataIndex: 'status',
            //data - 后端返回的状态status 根据他做条件渲染
            //1为待审核  2为审核通过   
            render: data => status[data]
        },
        {
            title: '发布时间',
            dataIndex: 'pubdate'
        },
        {
            title: '阅读数',
            dataIndex: 'read_count'
        },
        {
            title: '评论数',
            dataIndex: 'comment_count'
        },
        {
            title: '点赞数',
            dataIndex: 'like_count'
        },
        {
            title: '操作',
            render: data => {
                return (
                    <Space size="middle">
                        <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => navigate(`/publish?id=${data.id}`)} />
                        <Popconfirm
                            title="确认删除该条文章吗?"
                            onConfirm={() => onConfirm(data)}
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button
                                type="primary"
                                danger
                                shape="circle"
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Space>
                )
            }
        }
    ]
    // 准备表格body数据
    // const data = [
    //     {
    //         id: '8218',
    //         comment_count: 0,
    //         cover: {
    //             images: [],
    //         },
    //         like_count: 0,
    //         pubdate: '2019-03-11 09:00:00',
    //         read_count: 2,
    //         status: 2,
    //         title: 'wkwebview离线化加载h5资源解决方案'
    //     }
    // ]
    //1.准备参数
    const [reqData, setReqData] = useState({
        status: '',
        channel_id: '',
        begin_pubdate: '',
        end_pubdate: '',
        page: 1,
        per_page: 4
    })
    //获取文章列表
    const [list, setList] = useState([])
    const [count, setcount] = useState(0)

    useEffect(() => {
        async function getList() {
            const res = await getArticleListApi(reqData)
            setList(res.data.results)
            setcount(res.data.total_count)
        }
        getList()

    }, [reqData])


    //2.获取筛选数据
    const onFinish = (formValue) => {
        console.log(formValue)
        //3.把表单收集到的数据放到参数中（不可变方式）
        setReqData({
            ...reqData,
            channel_id: formValue.channel_id,
            status: formValue.status,
            begin_pubdate: formValue.date[0].format('YYYY-MM-DD'),
            end_pubdate: formValue.date[1].format('YYYY-MM-DD')
        })
        //4.重新渲染列表组件
        //只需要让useEffect重新加载就行了

    }
    //分页
    const onPageChange = (page) => {
        console.log(page)
        setReqData({
            ...reqData,
            page
        })
    }
    //删除
    const onConfirm = async (data) => {
        console.log('shanchule', data)
        await delArticleApi(data.id)
        if (list.length === 1 && reqData.page > 1) {
            setReqData({
                ...reqData,
                page: reqData.page - 1
            })

        } else {
            setReqData({
                ...reqData,

            })
        }

    }
    return (
        <div>
            <Card
                title={
                    <Breadcrumb items={[
                        { title: <Link to={'/'}>首页</Link> },
                        { title: '文章列表' },
                    ]} />
                }
                style={{ marginBottom: 20 }}
            >
                <Form initialValues={{ status: '' }} onFinish={onFinish}>
                    <Form.Item label="状态" name="status">
                        <Radio.Group>
                            <Radio value={''}>全部</Radio>
                            <Radio value={0}>草稿</Radio>
                            <Radio value={2}>审核通过</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="频道" name="channel_id">
                        <Select
                            placeholder="请选择文章频道"

                            style={{ width: 120 }}
                        >
                            {channelList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}

                        </Select>
                    </Form.Item>

                    <Form.Item label="日期" name="date">
                        {/* 传入locale属性 控制中文显示*/}
                        <RangePicker locale={locale}></RangePicker>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: 40 }} >
                            筛选
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <Card title={`根据筛选条件共查询到 ${count} 条结果：`}>
                <Table rowKey="id" columns={columns} dataSource={list} pagination={{
                    total: count,
                    pageSize: reqData.per_page,
                    onChange: onPageChange
                }} />
            </Card>
        </div>
    )
}

export default Article