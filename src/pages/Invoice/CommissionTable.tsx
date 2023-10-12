import Table, { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import React from 'react'
interface Commission {
    id: string;
    sale_id: string;
    amount: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

const columns: ColumnsType<any> = [
    {
        title: 'ID',
        dataIndex: 'id',
        width: '10%',
    },
    {
        title: 'Ngày',
        dataIndex: 'created_at',
        width: '10%',
        render: (_: any, record: any) => {
            return moment(_).format('DD/MM/YYYY')
        }
    },
    {
        title: 'Mô tả',
        dataIndex: 'description',
        width: '15%',
    },
    {
        title: 'Số tiền',
        dataIndex: 'amount',
        width: '15%',
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
];

function CommissionTable({ data }: { data: Array<Commission> }) {
    return (
        <div>

            <Table
                columns={columns}
                rowKey={record => record.id}
                dataSource={data}
                scroll={{ x: 'max-content', y: '100%' }}
            />
        </div>
    )
}

export default CommissionTable