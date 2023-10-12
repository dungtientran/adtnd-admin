import type { SignalModel } from '@/interface/signal';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';

import { BorderOuterOutlined, MenuOutlined, StarFilled, UploadOutlined } from '@ant-design/icons';
import {
    Button,
    DatePicker,
    Dropdown,
    Table,
    Typography,
    notification,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { approveInvoice, createInvoice, getInvoice } from '@/api/invoice';
import { Link } from 'react-router-dom';
import { getColumnSearchProps } from '../components/Table/SearchInTable';


interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: string;
    filters?: Record<string, FilterValue>;
}

const Invoicetable: React.FC = () => {
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState('');
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    // search
    const [staffCode, setStaffCodeSearch] = useState(null);
    const [name, setNameSearch] = useState(null);
    const [email, setEmailSearch] = useState(null);
    const [phone, setPhoneSearch] = useState(null);

    //enum true: dài hạn,false: ngắn hạn
    const [typeFilter, setTypeFilter] = useState(null);
    //enum ['closed', 'new', 'open']
    const [statusFilter, setStatusFilter] = useState(null);
    const [priorityFilter, setPriorityFilter] = useState(null);
    const [codeFilter, setCodeFilter] = useState<string>('');
    const [dateSort, setDateSort] = useState('DESC');

    const [filterQuery, setFilterQuery] = useState('');


    const actions = (record: any) => {
        const actionList = [];
        actionList.push({
            key: '5',
            label: (
                <Typography
                    onClick={() => {
                        console.log(record);
                        handleApprove(record.id)
                    }}
                >
                    {'Duyệt'}
                </Typography>
            ),
        });
        return actionList;
    };

    const actionsColumn = {
        title: 'ACTION',
        width: '10%',
        editable: false,
        render: (_: any, record: any) => (
            <Dropdown menu={{ items: actions(record) }} arrow placement="bottom">
                <Button type="ghost" size="small" shape="circle" >
                    <MenuOutlined />
                </Button>
            </Dropdown>
        ),
    };

    const columns: ColumnsType<any> = [
        {
            title: 'Mã chứng từ',
            dataIndex: 'id',
            width: '10%',
            render: (_: any, record: any) => {
                return <Link to={'/invoice/detail/' + _} style={{ textDecoration: 'none' }}>{_}</Link>
            }
        },
        {
            title: 'Kỳ thanh toán',
            dataIndex: 'payment_period',
            width: '10%',
        },
        {
            title: 'Mã KH',
            dataIndex: ['sale', 'staff_code'],
            width: '8%',
            ...getColumnSearchProps({
                setFilter: setStaffCodeSearch,
            }),
        },
        {
            title: 'Email',
            dataIndex: ['sale', 'email'],
            width: '15%',
            ...getColumnSearchProps({
                setFilter: setEmailSearch,
            }),
        },
        {
            title: 'SDT',
            dataIndex: ['sale', 'phone_number'],
            width: '10%',
            ...getColumnSearchProps({
                setFilter: setPhoneSearch,
            }),
        },
        {
            title: 'Hoa hồng thanh toán trong kỳ',
            dataIndex: 'commission_in_period',
            width: '15%',
            render: (_: any, record: any) => {
                return parseInt(_).toLocaleString()
            }
        },
        {
            title: 'Hoa hồng tạm tính',
            dataIndex: 'commission_provisional',
            width: '10%',
            render: (_: any, record: any) => {
                return parseInt(_).toLocaleString()
            }
        },
        {
            title: 'Tình trạng',
            dataIndex: 'status',
            width: '10%',
            render: (_: any, record: any) => {
                return _ == 'pending' ? 'Chưa duyệt' : 'Đã duyệt'
            }
        },
        actionsColumn,
    ];

    const getData = async () => {
        setLoading(true);
        await getInvoice(tableParams.pagination, filterQuery)
            .then((data: any) => {
                if (data.code === 200) {
                    setTableParams({
                        ...tableParams,
                        pagination: {
                            ...tableParams.pagination,
                            total: data?.data?.count,
                        },
                    });
                    console.log(data.data);
                    setData(data?.data?.rows);
                }
            })
            .catch(error => {
                console.log(error);
            });

        setLoading(false);
    };
    const handleApprove = async(id: string) => {
        await approveInvoice(id).then((res: any) => {
            if(res.code === 200) {
                const new_data = [...data].map((item: any) => {
                    if(item.id === id) {
                        return {
                            ...item,
                            status: 'approve'
                        }
                    }
                    return item;
                })
                setData(new_data);
                notification.success({
                    message: 'Thao tác thành công!'
                })
            }
        }).catch((err)=>{
            console.log(err)
            notification.error({
                message: err.message
            })
        })
    }

    useEffect(() => {
        if (name != null || email != null || staffCode != null || phone != null) {
            let query = '';
            if (name) {
                query += `&name=${name}`;
            }
            if (email) {
                query += `&email=${email}`;
            }
            if (staffCode) {
                query += `&staff_code=${staffCode}`;
            }
            if (phone) {
                query += `&phone=${phone}`;
            }
            console.log(query);
            //////////////////
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    current: 1
                }
            });
            setFilterQuery(query);
        }
    }, [name, email, phone,staffCode]);
    useEffect(() => {
        getData();
    }, [JSON.stringify(tableParams), filterQuery]);

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        console.log(pagination);
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };
    const handleCreateInvoice = async () => {
        {
            await createInvoice(period).then((res: any) => {
                console.log(res)
                if (res.code === 200) {
                    const new_data = [...res.data.data, data]
                    setData(new_data)
                    notification.success({
                        message: 'Thao tác thành công!'
                    })
                }
            }).catch((err) => {
                console.log(err)
                notification.error({
                    message: err.message
                })
            })
        }
    }

    return (
        <div className="aaa">
            <div style={{ textAlign: 'center' }}>
                <Typography.Title level={2}>Chứng từ thanh toán</Typography.Title>
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <DatePicker
                    onChange={(e: any) => {
                        console.log(moment(e.$d).format('YYYY-MM-DD'))
                        setPeriod(moment(e.$d).format('YYYY-MM-DD'))
                    }}
                    picker="month"
                    placeholder='Chọn kỳ thanh toán'
                    style={{ width: 180 }}
                />
                <Button onClick={() => {
                    handleCreateInvoice()
                }}>
                    Tính toán
                </Button>
            </div>
            <Table
                columns={columns}
                rowKey={record => record.id}
                dataSource={data}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
                scroll={{ x: 'max-content', y: '100%' }}
            />

        </div>
    );
};

export default Invoicetable;
