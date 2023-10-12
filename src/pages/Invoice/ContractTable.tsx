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
        title: 'Mã khách hàng',
        dataIndex: 'description',
        width: '15%',
    },
    {
        title: 'Giá trị ban đầu',
        dataIndex: 'description',
        width: '15%',
    },
    {
        title: 'Giá trị dự kiến',
        dataIndex: 'description',
        width: '15%',
    },
    {
        title: 'Lợi nhuận (%)',
        dataIndex: 'amount',
        width: '15%',
        render: (_: any, record: any) => {
            return parseInt(_).toLocaleString()
        }
    },
    {
        title: 'Ngày bắt đầu hợp đồng',
        dataIndex: 'start_date',
        width: '15%',
    },
    {
        title: 'Ngày kết thúc hợp đồng',
        dataIndex: 'start_date',
        width: '15%',
    },
];

function ContractTable({ data }: { data: Array<Commission> }) {
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

export default ContractTable