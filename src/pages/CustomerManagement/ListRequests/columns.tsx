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
    setSearchQuery((prev: any) => ({
      ...prev,
      [dataIndex]: selectedKeys,
    }));
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
      title: 'Ngày yêu cầu',
      dataIndex: 'created_at',
      render: (_, record) => <Text>{moment(record.created_at).format('DD/MM/YYYY')}</Text>,
      width: '14%',
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'name',
      width: '8%',
      ...ColumnSearchProps('name', 'tên khách hàng', setSearchQuery),
    },
    {
      title: 'SĐT',
      // sorter: true,
      dataIndex: 'phone_number',
      width: '15%',
      ...ColumnSearchProps('phone_number', 'tên khách hàng', setSearchQuery),
    },
    {
      title: 'Email',
      // sorter: true,
      dataIndex: 'email',
      width: '14%',
      ...ColumnSearchProps('email', 'email', setSearchQuery),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      width: '14%',
      ...ColumnSearchProps('address', 'địa chỉ', setSearchQuery),
    },
    {
      title: 'Loại hỗ trợ',
      dataIndex: 'type',
      width: '8%',
      filters: [
        { text: 'Tư vấn mở tài khoản', value: 'trial' },
        { text: 'Tư vẫn đầu tư', value: 'vip' },
        { text: 'Hỗ trợ', value: 'premium' },
      ],
    },
    {
      title: 'Liên lạc',
      dataIndex: 'is_contact',
      width: '8%',
      render: (_, record) => (
        <>{record.is_contact ? <Tag color="processing">Đã liên lạc</Tag> : <Tag color="magenta">Chưa liên lạc</Tag>}</>
      ),
    },
    {
      title: 'Action',
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
          <Popconfirm title="Chắc chắn xóa" onConfirm={() => deleteRequest(record.id)}>
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
