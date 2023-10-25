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
    if (dataIndex === 'fullname') {
      setSearchQuery((prev: any) => ({
        ...prev,
        name: selectedKeys,
      }));
    } else if (dataIndex === 'SaleLevel') {
      setSearchQuery((prev: any) => ({
        ...prev,
        level: selectedKeys,
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
) => {
  const columns: ColumnsType<DataType> = [
    {
      title: 'Mã nhân viên',
      dataIndex: 'staff_code',
      width: '8%',
      ...ColumnSearchProps('staff_code', 'mã nhân viên', setSearchQuery),
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullname',
      width: '8%',
      ...ColumnSearchProps('fullname', 'họ tên', setSearchQuery),
    },
    {
      title: 'Số điện thoại',
      // sorter: true,
      dataIndex: 'phone_number',
      width: '15%',
      ...ColumnSearchProps('phone_number', 'số điện thoại', setSearchQuery),
    },
    {
      title: 'Email',
      // sorter: true,
      dataIndex: 'email',
      width: '14%',
      ...ColumnSearchProps('email', 'email', setSearchQuery),
    },
    {
      title: 'Chức vụ',
      dataIndex: 'role',
      width: '14%',
      // ...ColumnSearchProps('role', 'chức vụ', setSearchQuery),
      render: (_, record) => <Text>{record?.role?.name}</Text>,
      // filters: [
      //   { text: 'Quản Trị', value: 'admin' },
      //   { text: 'Sale', value: 'sale' },
      //   { text: 'analytics', value: 'Nhân viên Phân tích' },
      //   { text: 'business', value: 'Nhân viên nghiệp vụ' },
      // ],
    },
    {
      title: 'Level',
      dataIndex: 'SaleLevel',
      width: '8%',
      ...ColumnSearchProps('SaleLevel', 'level', setSearchQuery),
      render: (_, record) => <Text>{record?.SaleLevel?.level}</Text>,
    },
    {
      title: '',
      dataIndex: 'action',
      width: '8%',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setOpenDrawer(true);
              setCustomerSelect(record);
            }}
          >
            <EditOutlined />
          </Button>
          <Popconfirm title="Chắc chắn xóa" onConfirm={() => {}}>
            <Button
              type="primary"
              size="small"
              // onClick={() => {
              //   setCustomerSelect(record);
              // }}
            >
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return columns;
};
