import type { DataIndex, DataType } from './index.interface';
import type { InputRef } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { ColumnsType, FilterConfirmProps } from 'antd/es/table/interface';

import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import { Avatar, Button, Input, Space, Typography } from 'antd';
import { useRef, useState } from 'react';

import user from '@/assets/logo/user.png';

const { Text, Link } = Typography;

export const ColumnSearchProps = (
  dataIndex: DataIndex,
  title: string,
  setSearchQuery: (query: string) => void,
  setTextQuery: (text: string) => void,
): ColumnType<DataType> => {
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (selectedKeys: string, confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
    // confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
    setTextQuery(selectedKeys);

    switch (dataIndex) {
      case 'id':
        setSearchQuery(`id=${selectedKeys}`);
        break;
      case 'fullname':
        setSearchQuery(`name=${selectedKeys}`);
        break;
      case 'phone_number':
        setSearchQuery(`phone_number=${selectedKeys}`);
        break;
      case 'email':
        setSearchQuery(`email=${selectedKeys}`);
        break;
      default:
        break;
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
        <Space size="large">
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
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
  setTextQuery: (text: string) => void,
  setOpenDrawer: (isOpen: boolean) => void,
  setCustomerSelect: (customer: any) => void,
) => {
  const columns: ColumnsType<DataType> = [
    {
      title: 'Ngày yêu cầu',
      // dataIndex: 'id',
      // sorter: true,
      width: '14%',
    },
    {
      title: 'Tên khách hàng',
      // dataIndex: 'avatar_url',
      width: '8%',
      // render: (_, record) => (
      //   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      //     <Avatar src={record.avatar_url ? record.avatar_url : user} size="default" />
      //   </div>
      // ),
      ...ColumnSearchProps('id', 'tên khách hàng', setSearchQuery, setTextQuery),

    },
    {
      title: 'SĐT',
      // sorter: true,
      // dataIndex: 'fullname',
      width: '15%',
      ...ColumnSearchProps('fullname', 'tên khách hàng', setSearchQuery, setTextQuery),
    },
    {
      title: 'Email',
      // sorter: true,
      // dataIndex: 'phone_number',
      width: '14%',
      ...ColumnSearchProps('phone_number', 'email', setSearchQuery, setTextQuery),
    },
    {
      title: 'Địa chỉ',
      // dataIndex: 'email',
      width: '14%',
      ...ColumnSearchProps('email', 'địa chỉ', setSearchQuery, setTextQuery),
    },
    {
      title: 'Loại hỗ trợ',
      // dataIndex: 'subscription_product',
      width: '8%',
      filters: [
        // { text: 'Trial', value: 'trial' },
        // { text: 'Vip', value: 'vip' },
        // { text: 'Premium', value: 'premium' },
      ],
      // render: (_, record) => <Text>{record.subscription.subscription_product.name}</Text>,
    },
    {
      title: 'Đã liên lạc',
      // dataIndex: '',
      width: '8%',
      // render: (_, record) => <Text>0</Text>,
    },
    {
      title: 'Action',
      // dataIndex: 'remaining_subscription_day',
      width: '8%',
    },
   
  ];

  return columns;
};
