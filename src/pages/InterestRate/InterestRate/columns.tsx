import type { DataIndex, DataType } from './index.interface';
import type { InputRef } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { ColumnsType, FilterConfirmProps } from 'antd/es/table/interface';

import { DeleteOutlined, EditOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
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
  setOpenDrawer: (isOpen: boolean) => void,
  setCustomerSelect: (customer: any) => void,
  deleteRequest: (id: string) => void,
) => {
  const columns: ColumnsType<DataType> = [
    {
      title: 'Số hợp đồng',
      dataIndex: 'contract_no',
      // render: (_, record) => <Text>{moment(record.created_at).format('DD/MM/YYYY')}</Text>,
      // width: '14%',
    },
    {
      title: 'Mã KH',
      dataIndex: 'customer',
      // width: '8%',
      render: (_, record) => <Text>{record?.customer?.customer_code}</Text>,

      ...ColumnSearchProps('customer', 'tên khách hàng', setSearchQuery),
    },
    {
      title: 'Tên KH',
      dataIndex: 'customer',
      // width: '8%',
      render: (_, record) => <Text>{record?.customer?.fullname}</Text>,

      // ...ColumnSearchProps('name', 'tên khách hàng', setSearchQuery),
    },
    {
      title: 'SĐT',
      // sorter: true,
      dataIndex: 'customer',
      // width: '15%',
      render: (_, record) => <Text>{record?.customer?.phone_number}</Text>,

      // ...ColumnSearchProps('phone_number', 'tên khách hàng', setSearchQuery),
    },
    {
      title: 'Email',
      // sorter: true,
      dataIndex: 'customer',
      // width: '14%',
      render: (_, record) => <Text>{record?.customer?.email}</Text>,

      // ...ColumnSearchProps('email', 'email', setSearchQuery),
    },
    {
      title: 'Mã nhân viên QL',
      dataIndex: 'sale',
      // width: '14%',
      render: (_, record) => <Text>{record?.sale?.staff_code}</Text>,

      // ...ColumnSearchProps('address', 'địa chỉ', setSearchQuery),
    },
    {
      title: 'Tên nhân viên QL',
      dataIndex: 'sale',
      // width: '14%',
      render: (_, record) => <Text>{record?.sale?.fullname}</Text>,

      // ...ColumnSearchProps('address', 'địa chỉ', setSearchQuery),
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_date',
      // width: '8%',
      render: (_, record) => <Text>{moment(record?.start_date).format('DD/MM/YYYY')}</Text>,
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'end_date',
      // width: '8%',
      render: (_, record) => <Text>{moment(record?.end_date).format('DD/MM/YYYY')}</Text>,
    },
    {
      title: 'Giá trị ban đầu',
      dataIndex: 'initial_value',
      // width: '8%',
      render: (_, record) => <Text>{record?.initial_value?.toLocaleString()}</Text>,
    },
    {
      title: 'Lợi nhuận % (dự kiến)',
      dataIndex: 'expected_end_value',
      // width: '8%',
      render: (_, record) => <Text>{record?.expected_end_value?.toLocaleString()}</Text>,
    },
    {
      title: 'Hoa hồng tạm tính',
      dataIndex: 'commission',
      // width: '15%',
      render: (_, record) => <Text>{record?.commission?.toLocaleString()}</Text>,
    },
    {
      title: 'Tình trạng',
      dataIndex: 'status',
      // width: '8%',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      // width: '8%',
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
          <Button
            type="primary"
            size="small"
            // onClick={() => {
            //   setCustomerSelect(record);
            // }}
          >
            <EyeOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  return columns;
};
