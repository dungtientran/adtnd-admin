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
        title: 'Mã hợp đồng',
        dataIndex: 'contract_no',
        width: '10%',
    },
    {
        title: 'Kỳ',
        dataIndex: 'payment_period',
        width: '10%',
        render: (_: any, record: any) => {
            return moment(_).format('DD/MM/YYYY')
        }
    },
    {
        title: 'Mã khách hàng',
        dataIndex: ['customer', 'fullname'],
        width: '15%',
    },
    {
        title: 'Giá trị ban đầu',
        dataIndex: 'initial_value',
        width: '15%',
        render: (_, item) => parseInt(_).toLocaleString()
    },
    {
        title: 'Lợi nhuận (%)',
        dataIndex: 'profit_percent',
        width: '10%',
        render: (_: any, record: any) => {
            return parseInt(_).toLocaleString() + '%'
        }
    },
    {
        title: 'Hoa hồng',
        dataIndex: ['contract_commission', 'sales_commission'],
        width: '10%',
        render: (_: any, record: any) => {
            return parseInt(_).toLocaleString()
        }
    },
    {
        title: 'Ngày bắt đầu hợp đồng',
        dataIndex: 'start_date',
        width: '15%',
        render: (_: any, record: any) => {
            return moment(_).format('DD/MM/YYYY')
        }
    },
    {
        title: 'Ngày kết thúc hợp đồng',
        dataIndex: 'end_date',
        width: '15%',
        render: (_: any, record: any) => {
            return moment(_).format('DD/MM/YYYY')
        }
    },


];

function ContractTable({ data }: { data: Array<Commission> }) {
    console.log('data :>>>>>>>>>', data)
    return (
        <div>
            <Table
                columns={columns}
                rowKey={record => {
                    console.log('record', record)
                    return record?.id
                }}
                dataSource={data}
                scroll={{ x: 'max-content', y: '100%' }}
            />
        </div>
    )
}

export default ContractTable