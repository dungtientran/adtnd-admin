import type { SignalModel } from '@/interface/signal';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';

import { BorderOuterOutlined, MenuOutlined, StarFilled, UploadOutlined } from '@ant-design/icons';
import {
    Avatar,
    Button,
    Col,
    DatePicker,
    Dropdown,
    InputNumber,
    notification,
    Popconfirm,
    Radio,
    Row,
    Select,
    Slider,
    Space,
    Table,
    Tag,
    Typography,
    Upload,
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getInvoice, getInvoiceDetail } from '@/api/invoice';
import { Link, useParams } from 'react-router-dom';
import CommissionTable from './CommissionTable';
import InvoiceTable from './InvoiceTablePage';
import ContractTable from './ContractTable';


interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: string;
    filters?: Record<string, FilterValue>;
}


const Recommendations: React.FC = () => {
    const param = useParams()
    const id = param.id
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);


    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const [filterQuery, setFilterQuery] = useState('');

    const actions = (record: any) => {
        const actionList = [];

        if (record.is_approved && !record.is_closed) {
            actionList.push({
                key: '5',
                label: (
                    <Typography
                        onClick={() => {
                            console.log(record);

                        }}
                    >
                        {'Đóng'}
                    </Typography>
                ),
                danger: true,
            });
        }
        return actionList;
    };

    const actionsColumn = {
        title: 'ACTION',
        width: '10%',
        editable: false,
        render: (_: any, record: any) => (
            <Dropdown menu={{ items: actions(record) }} arrow placement="bottom">
                <Button type="ghost" size="small" shape="circle">
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
        },
        {
            title: 'Email',
            dataIndex: ['sale', 'email'],
            width: '15%',
        },
        {
            title: 'Hoa hồng thanh toán trong kỳ',
            dataIndex: 'commission_in_period',
            width: '12%',
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
        await getInvoiceDetail(id)
            .then((data: any) => {
                if (data.code === 200) {
                    setData(data.data)
                }
            })
            .catch(error => {
                console.log(error);
            });

        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, [id]);

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



    return (
        <div className="aaa">
            <div style={{ textAlign: 'center' }}>
                <Typography.Title level={2}>Bảng chi tiết hoa hồng</Typography.Title>
            </div>
            <div>
                <p><span style={{ fontWeight: '600' }}>Kì thanh toán :</span> {data?.invoice?.payment_period}</p>
                <p><span style={{ fontWeight: '600' }}>Mã khách hàng :</span> {data?.invoice?.sale?.staff_code}</p>
                <p><span style={{ fontWeight: '600' }}>Tên khách hàng :</span> {data?.invoice?.sale?.fullname}</p>
                <p><span style={{ fontWeight: '600' }}>SĐT :</span> {data?.invoice?.sale?.phone_number}</p>
                <p><span style={{ fontWeight: '600' }}>Email :</span> {data?.invoice?.sale?.email}</p>
            </div>
            <div>
                <Typography.Title level={3} style={{ textAlign: 'center' }}>Gói Premium</Typography.Title>
                <CommissionTable data={data?.commission} />
            </div>

            <div>
                <Typography.Title level={3} style={{ textAlign: 'center' }}>Hoa hồng tạm tính</Typography.Title>
                <ContractTable data={[]} />
            </div>

        </div>
    );
};

export default Recommendations;
