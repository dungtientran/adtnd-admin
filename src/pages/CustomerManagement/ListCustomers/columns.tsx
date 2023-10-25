import type { ColumnListCustomerType, DataIndex, DataType } from './index.interface';
import type { InputRef } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { ColumnsType, FilterConfirmProps } from 'antd/es/table/interface';

import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import { Avatar, Button, Input, Popconfirm, Space, Typography } from 'antd';
import { useRef, useState } from 'react';

import user from '@/assets/logo/user.png';
import { UseMutationResult } from '@tanstack/react-query';


const { Text, Link } = Typography;

export const ColumnSearchProps = (
  dataIndex: DataIndex,
  title: string,
  setSearchQuery: (query: any) => void,
): ColumnType<ColumnListCustomerType> => {
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (selectedKeys: string, confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
    if (dataIndex === 'fullname') {
      setSearchQuery((prev: any) => ({
        ...prev,
        name: selectedKeys,
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
  useCustomer: () => {
    deleteSale: UseMutationResult<any, unknown, any, unknown>;
  }
) => {
  const {deleteSale} = useCustomer();
  const columns: ColumnsType<ColumnListCustomerType> = [
    {
      title: 'Mã',
      dataIndex: 'customer_code',
      // sorter: true,
      width: '14%',
      ...ColumnSearchProps('customer_code', 'mã', setSearchQuery),
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
      // sorter: true,
      dataIndex: 'fullname',
      width: '10%',
      ...ColumnSearchProps('fullname', 'tên khách hàng', setSearchQuery),
    },
    {
      title: 'Số điện thoại',
      // sorter: true,
      dataIndex: 'phone_number',
      width: '14%',
      ...ColumnSearchProps('phone_number', 'sđt', setSearchQuery),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '18%',
      ...ColumnSearchProps('email', 'email', setSearchQuery),
    },
    {
      title: 'Gói dịch vụ',
      dataIndex: 'subscription_product',
      width: '8%',
      // filters: [
      //   { text: 'Trial', value: 'trial' },
      //   { text: 'Vip', value: 'vip' },
      //   { text: 'Premium', value: 'premium' },
      // ],
      // render: (_, record) => <Text>{record.subscription?.subscription_product?.name}</Text>,

    },
    {
      title: 'NAV',
      dataIndex: 'nav',
      width: '8%',
      sorter: true,

      render: (_, record) => <Text>{record?.nav?.toLocaleString()}</Text>,
    },
    {
      title: 'Số ngày còn lại',
      dataIndex: 'day_remaining',
      width: '8%',
      sorter: true,
    },
    {
      title: 'Nhân viên chăm, sóc',
      dataIndex: 'sale_name',
      width: '15%',
      render: (_, record) => (
        <Space size="middle">
          {record.sale_name ? (
            <Space direction="vertical">
              <Text strong>{record.sale_name}</Text>
              <Popconfirm title="Chắc chắn" onConfirm={() => deleteSale.mutate(record.id)}>
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
