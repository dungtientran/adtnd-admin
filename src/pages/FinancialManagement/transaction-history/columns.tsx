import type { DataIndex, DataType } from './index.interface';
import type { InputRef } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { ColumnsType, FilterConfirmProps } from 'antd/es/table/interface';

import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm, Space, Tag, Typography } from 'antd';
import moment from 'moment';
import { useRef } from 'react';

const { Text } = Typography;

export const ColumnSearchProps = (
  dataIndex: DataIndex,
  title: string,
  setSearchQuery: (query: any) => void,
): ColumnType<DataType> => {
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (selectedKeys: string, confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
    if (dataIndex === 'id') {
      setSearchQuery((prev: any) => ({
        ...prev,
        transaction_id: selectedKeys,
      }));
    } else {
      setSearchQuery((prev: any) => ({
        ...prev,
        [dataIndex]: selectedKeys,
      }));
    }
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  return {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm ${title}`}
          value={selectedKeys[0]}
          onChange={e => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            handleSearch(e.target.value, confirm, dataIndex);
          }}
          style={{ marginBottom: 8, display: 'block' }}
        />
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: text => text,
  };
};

export const Column = (
  setSearchQuery: (query: string) => void,
  setOpenDrawer: (isOpen: boolean) => void,
  setCustomerSelect: (customer: any) => void,
  deleteRequest: (id: string) => void,
) => {
  const columns: ColumnsType<DataType> = [
    {
      title: 'Ngày giao dịch',
      dataIndex: 'created_at',
      render: (_, record) => <Text>{moment(record.created_at).format('DD/MM/YYYY')}</Text>,
      width: '14%',
    },
    {
      title: 'Mã giao dịch',
      dataIndex: 'id',
      width: '8%',
      ...ColumnSearchProps('id', 'tên khách hàng', setSearchQuery),
    },
    {
      title: 'Mã khách hàng',
      // sorter: true,
      dataIndex: 'customer_code',
      width: '8%',
      ...ColumnSearchProps('customer_id', 'tên khách hàng', setSearchQuery),
    },
    {
      title: 'Tên khách hàng',
      // sorter: true,
      dataIndex: 'name',
      width: '8%',
      // render: (_, record) => <Text>{record?.customer?.fullname}</Text>,
      ...ColumnSearchProps('name', 'Tên khách hàng', setSearchQuery),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '14%',
      // render: (_, record) => <Text>{record.customer?.email}</Text>,
      ...ColumnSearchProps('email', 'địa chỉ', setSearchQuery),
    },
    {
      title: 'SĐT',
      dataIndex: 'phone_number',
      width: '14%',
      // render: (_, record) => <Text>{record.customer?.phone_number}</Text>,
      ...ColumnSearchProps('phone_number', 'địa chỉ', setSearchQuery),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: '112px',
    },
    {
      title: 'Gói dịch vụ',
      dataIndex: 'package',
      width: '10%',
      // render: (_, record) => (
      //   <Text>
      //     {record?.subscription_plan?.subscription_product?.name} {record?.subscription_plan?.name}
      //   </Text>
      // ),

      // width: '8%',
      // filters: [
      //   { text: 'Trial', value: 'trial' },
      //   { text: 'Vip', value: 'vip' },
      //   { text: 'Premium', value: 'premium' },
      // ],
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      width: '8%',
      sorter: true,
      render: (_, record) => <Text>{record?.amount ? record.amount?.toLocaleString() : 0} VND</Text>,
    },
  ];

  return columns;
};
