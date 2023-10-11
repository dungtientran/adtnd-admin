import { DeleteMemberForm, deleteGroupMember, getGroupMember } from '@/stores/group/group.actions'
import { Avatar, Button, Checkbox, Dropdown, Table, TablePaginationConfig, Typography } from 'antd'
import { FilterValue } from 'antd/es/table/interface';
import React, { useEffect, useState, useCallback } from 'react'
import { getColumnSearchProps } from '../components/Table/SearchInTable';
import { MenuOutlined } from '@ant-design/icons'

import { useDispatch, useSelector } from 'react-redux'
import AddMember from '@/components/drawer/AddMemberGroupDrawer';
interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: string;
    filters?: Record<string, FilterValue>;
}
function GroupMemberTable({ group_id }: { group_id: string | undefined }) {
    const subscriptions = useSelector(state => state.subsciptions.subscriptions)
    const data = useSelector(state => state.group.groupMembers)
    const groupDetail = useSelector(state => state.group.groupDetail)
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
            total: groupDetail?.member_count
        },
    });
    const [selectedRow, setSelectedRow] = useState<any>([]);
    // live search state
    const [nameSearch, setNameSearch] = useState(null)
    const [emailSearch, setEmailSearch] = useState(null);
    const [phoneSearch, setPhoneSearch] = useState(null);
    const [subsciptionFilter, setSubsciptionFilter] = useState<any>([]);
    const [filterQuery, setFilterQuery] = useState<any>([]);


    // --------------
    const [openAddMember, setOpenAddMember] = useState(false)
    const dispacth = useDispatch()
    const fetchData = useCallback(() => {
        if (group_id) {
            dispacth(getGroupMember(group_id, tableParams.pagination, filterQuery))
        }
    }, [group_id, tableParams.pagination, filterQuery])

    const handleDeleteMember = (form: DeleteMemberForm) => {
        dispacth(deleteGroupMember(form))
    }
    const subscriptionFilterChange = (isAdd: boolean, value: string) => {
        const new_data = [...subsciptionFilter]
        if (isAdd) {
            new_data.push(value);
        } else {
            const index = new_data.indexOf(value);
            if (index !== -1) {
                new_data.splice(index, 1);
            }
        }
        setSubsciptionFilter(new_data.length > 0 ? new_data : [''])
    }
    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        console.log(pagination)
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

    };

    useEffect(() => {
        fetchData()
    }, [fetchData])
    useEffect(() => {
        setTableParams({
            ...tableParams,
            pagination: {
                ...tableParams.pagination,
                total: groupDetail?.member_count
            }
        })
    }, [groupDetail?.member_count])


    useEffect(() => {
        if (nameSearch != null || emailSearch != null || phoneSearch != null ||subsciptionFilter.length > 0) {
            let query = ''
            if (nameSearch) {
                query += '&name=' + nameSearch
            }
            if (emailSearch) {
                query += '&email=' + emailSearch
            }
            if (phoneSearch) {
                query += '&phone_number=' + phoneSearch
            }
            if (subsciptionFilter.length > 0) {
                query += `&subscriptions=${subsciptionFilter.join(',')}`
            }
            setFilterQuery(query)
        }
    }, [nameSearch, emailSearch, phoneSearch,subsciptionFilter])

    const actions = (record: any) => {
        const actionList = [];
        actionList.push({
            key: '1',
            label: <Typography className='text-[red]' onClick={() => {
                if (group_id) {
                    handleDeleteMember({
                        group_id: group_id,
                        customer_id: record.id
                    })
                }
            }}>Xóa</Typography>,
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
            title: 'Ảnh đại diện',
            dataIndex: 'avatar_url',
            width: '8%',
            render: (_: any, record: any) => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Avatar
                        src={record.avatar_url}
                        size="large"
                        onClick={() => {
                            // setModalOpen(true), setRecordSelected(record);
                        }}
                    />
                </div>
            ),
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'fullname',
            render: (text: string) => <Typography className='text-center'>{text}</Typography>,
            ...getColumnSearchProps({
                setFilter: setNameSearch,
            }),
        },
        {
            title: 'Gói dịch vụ',
            dataIndex: ['subscription_product', 'name'],
            dataType: 'text',
            width: '20%',
            render: (text: any, record: any) => {
                return <Typography className='text-center'>
                    {record?.Subscriptions?.length > 0 ? record?.Subscriptions[0]?.subscription_product?.name : 'Không có '}
                </Typography>
            },
            filterDropdown: () => {
                return <div>
                    <Checkbox.Group
                        className='flex-col ps-[5px]'
                    >
                        {subscriptions?.map((item: any, index: number) => {
                            return (
                                <Checkbox
                                    value={item.id}
                                    className={`${index == 0 ? 'ml-[8px]' : ''}`}
                                    onChange={(e) => {
                                        subscriptionFilterChange(e.target.checked, item.id);
                                    }}
                                >
                                    {item.name}
                                </Checkbox>
                            )
                        })}
                    </Checkbox.Group>
                </div>
            }
        },
        {
            title: 'Số điện thoại',
            sorter: true,
            dataIndex: 'phone_number',
            ...getColumnSearchProps({
                setFilter: setPhoneSearch,
            }),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: '8%',
            ...getColumnSearchProps({
                setFilter: setEmailSearch,
            }),
        },
        actionsColumn
    ];

    return (
        <div className='mt-[10px]'>
            <div style={{ textAlign: 'center' }}>
                <Typography.Title level={2}>Danh Sách thành viên</Typography.Title>
            </div>
            <div className='flex justify-center'>
                <Button onClick={() => {
                    // setUpdate(null)
                        setOpenAddMember(true)
                }}>
                    <Typography>Thêm thành viên</Typography>
                </Button>
            </div>
            <Typography className='mt-[10px]'>Có tất cả {tableParams.pagination?.total} kết quả</Typography>
            <div>
                {selectedRow.length > 0 && (
                    <>
                        <Button type="primary" danger onClick={() => {
                            if (group_id) {
                                handleDeleteMember({
                                    group_id: group_id,
                                    customer_ids: selectedRow
                                })
                            }
                        }}>
                            Xóa khỏi nhóm
                        </Button>

                    </>
                )}
            </div>
            <div>
                <Table
                    columns={columns}
                    rowKey={record => record.id}
                    dataSource={data.members}
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
            <AddMember
                open={openAddMember}
                onClose={()=> setOpenAddMember(false)}
                onSubmit={()=>{}}
                group_id={group_id}
            />
        </div>
    )
}

export default GroupMemberTable