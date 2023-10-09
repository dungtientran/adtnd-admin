import { createGroup, getGroupList, updateGroup } from '@/api/group';
import { Button, Dropdown, Table, TablePaginationConfig, Typography, notification } from 'antd'
import { PaginationConfig } from 'antd/es/pagination';
import { FilterValue } from 'antd/es/table/interface';
import React, { useEffect, useState } from 'react'
import './index.less'
import { Link } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons'
import { getColumnSearchProps } from '../Signal/SearchInTable';
import CreateGroupModal from '@/components/modal/Group/CreateGroupModal';
interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: string;
    filters?: Record<string, FilterValue>;
}
function GroupTablePage() {
    const [data, setData] = useState<any>()
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    const [selectedRow, setSelectedRow] = useState<any>([]);


    // live search state
    const [nameSearch, setNameSearch] = useState(null)
    const [filterQuery, setFilterQuery] = useState('');

    //modal state -------------------------->
    const [groupModal, setGroupModal] = useState<boolean>(false);
    const [update,setUpdate] = useState<any>()


    // --------------
    const getData = async () => {
        await getGroupList(tableParams.pagination,'',filterQuery).then((data: any) => {
            console.log(data)
            if (data) {
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: data?.count
                    }
                })
                setData(data?.data)
            }
        }).catch(error => {
            console.log(error)
        })
    };
    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        console.log(pagination)
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    const actions = (record: any) => {
        const actionList = [];
        actionList.push({
            key: '1',
            label: <Typography onClick={() => {
                console.log(record.id)
            }}>Xem chi tiết</Typography>,
        });
        actionList.push({
            key: '2',
            label: <Typography onClick={() => {
                setUpdate(record)
                setGroupModal(true)
            }}>Sửa</Typography>,
        });
        return actionList;
    };

    const actionsColumn = {
        title: 'ACTION',
        width: '20%',
        editable: false,
        render: (_: any, record: any) => (
            <Dropdown menu={{ items: actions(record) }} arrow placement="bottom">
                <Button type="ghost" size="small" shape="circle" >
                    <MenuOutlined />
                </Button>
            </Dropdown>
        ),
    };
    const columns = [
        {
            title: 'Tên nhóm',
            dataIndex: 'name',
            dataType: 'text',
            width: '30%',
            render: (text: string, record: any) => <Link to={`/user-group/${record.id}`} className='text-left'>{text}</Link>,
            ...getColumnSearchProps({
                setFilter: setNameSearch,
              }),
        },
        {
            title: 'Gói dịch vụ',
            dataIndex: ['subscription_product', 'name'],
            dataType: 'text',
            width: '20%',
            render : (text: string, record: any) => <Typography className='text-center'>{text}</Typography>
        },
        {
            title: 'Nhân viên chăm sóc',
            dataIndex: ['sale', 'email'],
            dataType: 'text',
            width: '20%',
            render : (text: string, record: any) => <Typography className='text-center'>{text}</Typography>
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            width: '20%',
        },
        actionsColumn
    ];


    useEffect(()=>{
        if(nameSearch != null){
            let query = ''
            if(nameSearch){
                query += `&searchText=${nameSearch}`
            }
            setFilterQuery(query)
        }
    },[nameSearch])
    useEffect(() => {
        getData()
    }, [JSON.stringify(tableParams),filterQuery])

    const handleCreateGroup = async (form: any) => {
        console.log(form)
        if(update){
            return await updateGroup(update.id, form).then((res: any) => {
                const new_data = [...data].map((item) => {
                    if(item.id == update.id) {
                        return {
                            ...item,
                            ...form
                        }
                    }
                    return item
                })
                setData(new_data)
                setUpdate(null)
                setGroupModal(false)
                notification.success(({
                    message: 'Cập nhật thành công!'
                }))
                return true
            }).catch(error => {
                notification.error(({
                    message: error.message
                }))
                return true
            });
        }else {
            return await createGroup(form).then((res: any) => {
                if(res.code == 200){
                    const new_data = [res.data,...data]
                    setData(new_data)
                }
                notification.success(({
                    message: 'Tạo thành công!'
                }))
                setGroupModal(false)
            }).catch(err => {
                console.log('err when creating group', err)
                notification.error(({
                    message: err.message
                }))
                return true
            })
        }
    }
    return (
        <div>
            <div style={{ textAlign: 'center' }}>
                <Typography.Title level={2}>Danh sách nhóm khách hàng</Typography.Title>
            </div>
            <div>
                <Button onClick={()=> {
                    setUpdate(null)
                    setGroupModal(true)
                }}>
                    <Typography>Tạo nhóm mới</Typography>
                </Button>
            </div>
            <Typography className='mt-[10px]'>Có tất cả {tableParams.pagination?.total} kết quả</Typography>
            <div>
                <Table
                    columns={columns}
                    rowKey={record => record.id}
                    dataSource={data}
                    pagination={tableParams.pagination}
                    onChange={handleTableChange}
                    scroll={{ x: 'max-content', y: '100%' }}
                    rowSelection={{
                        type: 'checkbox',
                        onChange: (value: any) => {
                            console.log(value)
                            setSelectedRow(value);
                        }
                    }}
                />
            </div>
            <CreateGroupModal
                data={update}
                setData={setGroupModal}
                open={groupModal}
                handleOk={handleCreateGroup}
                handleCancel={()=>{
                    setGroupModal(false)
                }}
            />
        </div>
    )
}

export default GroupTablePage