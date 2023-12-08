import type { ColumnTyle, DataIndex, DataType } from './index.interface';
import type { InputRef } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { ColumnsType, FilterConfirmProps } from 'antd/es/table/interface';

import './index.less';

import { EditOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Tag, Typography } from 'antd';
import moment from 'moment';
import { Fragment, useRef } from 'react';

const { Text } = Typography;

export const ColumnSearchProps = (
  dataIndex: DataIndex,
  title: string,
  setSearchQuery: (query: any) => void,
): ColumnType<ColumnTyle> => {
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
  setOpenModel: (open: boolean) => void,
) => {
  const columns: ColumnsType<ColumnTyle> = [
    {
      title: 'Số hợp đồng',
      dataIndex: 'contract_no',
      // render: (_, record) => <Text>{moment(record.created_at).format('DD/MM/YYYY')}</Text>,
      width: '5%',
      ...ColumnSearchProps('contract_no', 'mã hợp đồng', setSearchQuery),
    },
    {
      title: 'Mã KH',
      dataIndex: 'customer_code',
      width: '6%',
      // ...ColumnSearchProps('customer_code', 'mã KH', setSearchQuery),
    },
    {
      title: 'Tên KH',
      dataIndex: 'name',
      width: '8%',
      // render: (_, record) => <Text>{record?.customer?.fullname}</Text>,

      ...ColumnSearchProps('name', 'tên khách hàng', setSearchQuery),
    },
    {
      title: 'SĐT',
      // sorter: true,
      dataIndex: 'phone_number',
      // width: '15%',
      // render: (_, record) => <Text>{record?.customer?.phone_number}</Text>,

      ...ColumnSearchProps('phone_number', 'số điện thoại', setSearchQuery),
    },
    {
      title: 'Email',
      // sorter: true,
      dataIndex: 'email',
      width: '8%',
      // render: (_, record) => <Text>{record?.customer?.email}</Text>,

      ...ColumnSearchProps('email', 'email', setSearchQuery),
    },
    {
      title: 'Mã nhân viên QL',
      dataIndex: 'staff_code',
      width: '8%',
      // render: (_, record) => <Text>{record?.sale?.staff_code}</Text>,

      ...ColumnSearchProps('staff_code', 'mã NVQL', setSearchQuery),
    },
    {
      title: 'Tên nhân viên QL',
      dataIndex: 'name_sale',
      width: '10%',
      // render: (_, record) => <Text>{record?.sale?.fullname}</Text>,

      ...ColumnSearchProps('name_sale', 'tên nhân viên QL', setSearchQuery),
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_date',
      width: '8%',
      render: (_, record) => <Text>{moment(record?.start_date).format('DD/MM/YYYY')}</Text>,
      sorter: true,
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'end_date',
      width: '8%',
      render: (_, record) => <Text>{moment(record?.end_date).format('DD/MM/YYYY')}</Text>,
      sorter: true,
    },
    {
      title: 'Giá trị ban đầu',
      dataIndex: 'initial_value',
      width: '10%',
      render: (_, record) => <Text>{record?.initial_value?.toLocaleString()}</Text>,
      sorter: true,
    },
    {
      title: 'Lợi nhuận % ',
      dataIndex: 'profit_percent',
      width: '8%',
      render: (_, record) => <Tag color={record?.profit_percent > 0 ? 'blue' : 'red'}>{record?.profit_percent}</Tag>,
      sorter: true,
    },
    {
      title: 'Hoa hồng  (Fila)',
      dataIndex: 'commission',
      width: '10%',
      render: (_, record) => <Text>{record?.commission?.toLocaleString()}</Text>,
      sorter: true,
    },
    // {
    //   title: 'Tổng hoa hồng (Fila)',
    //   dataIndex: 'total_commission',
    //   width: '12%',
    //   render: (_, record) => <Text>{ record?.total_commission ? record?.total_commission?.toLocaleString() : '0'}</Text>,
    // },
    {
      title: 'Tình trạng',
      dataIndex: 'status',
      width: '5%',
      render: (_, record) => <Tag color="red">{record?.status}</Tag>,
      // render: (_, record) => (
      //   <Fragment>
      //     {record?.status === 'Đang có hiệu lực' ? (
      //       <Tag color="#108ee9">Đang có hiệu lực</Tag>
      //     ) : (
      //       <Tag color="red">Đã thanh lý</Tag>
      //     )}
      //   </Fragment>
      // ),
    },
    {
      title: '',
      dataIndex: 'action',
      // width: '8%',
      render: (_, record) => (
        <Space size="small">
          {/* <Button
            type="primary"
            size="small"
            onClick={() => {
              setOpenDrawer(true);
              setCustomerSelect(record);
            }}
          >
            <EditOutlined />
          </Button> */}
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setCustomerSelect(record);
              setOpenModel(true);
            }}
          >
            <EyeOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  return columns;
};
