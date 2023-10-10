import type { DataIndex, DataType } from './index.interface';
import type { InputRef } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { ColumnsType, FilterConfirmProps } from 'antd/es/table/interface';

import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import { Avatar, Button, Input, Popconfirm, Space, Typography } from 'antd';
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
  setCustomerId: (id: string) => void,
) => {
  const columns: ColumnsType<DataType> = [
    {
      title: 'Mã',
      dataIndex: 'id',
      // sorter: true,
      width: '14%',
      ...ColumnSearchProps('id', 'mã', setSearchQuery, setTextQuery),
    },
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar_url',
      width: '8%',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Avatar src={record.avatar_url ? record.avatar_url : user} size="default" />
        </div>
      ),
    },
    {
      title: 'Tên khách hàng',
      sorter: true,
      dataIndex: 'fullname',
      width: '15%',
      ...ColumnSearchProps('fullname', 'tên khách hàng', setSearchQuery, setTextQuery),
    },
    {
      title: 'Số điện thoại',
      sorter: true,
      dataIndex: 'phone_number',
      width: '14%',
      ...ColumnSearchProps('phone_number', 'sđt', setSearchQuery, setTextQuery),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '14%',
      ...ColumnSearchProps('email', 'email', setSearchQuery, setTextQuery),
    },
    {
      title: 'Gói dịch vụ',
      dataIndex: 'subscription_product',
      width: '8%',
      filters: [
        { text: 'Trial', value: 'trial' },
        { text: 'Vip', value: 'vip' },
        { text: 'Premium', value: 'premium' },
      ],
      render: (_, record) => <Text>{record.subscription.subscription_product.name}</Text>,
    },
    {
      title: 'NAV',
      dataIndex: '',
      width: '8%',
      render: (_, record) => <Text>0</Text>,
    },
    {
      title: 'Số ngày còn lại',
      dataIndex: 'remaining_subscription_day',
      width: '8%',
    },
    {
      title: 'Nhân viên chăm, sóc',
      dataIndex: 'careby',
      width: '15%',
      render: (_, record) => (
        <Space size="middle">
          {record.careby ? (
            <Space direction="vertical">
              <Text strong>{record.careby.sale.fullname}</Text>
              <Popconfirm title="Chắc chắn" onConfirm={() => setCustomerId(record.id)}>
                <Link>Xóa</Link>
              </Popconfirm>
            </Space>
          ) : (
            <Button
              type="primary"
              size="middle"
              onClick={() => {
                setOpenDrawer(true);
                setCustomerSelect(record);
              }}
            >
              <UserAddOutlined />
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return columns;
};
