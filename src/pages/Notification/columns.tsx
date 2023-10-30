import type { DataIndex, DataType } from './index.interface';
import type { UseMutationResult } from '@tanstack/react-query';
import type { InputRef } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { ColumnsType, FilterConfirmProps } from 'antd/es/table/interface';

import { DeleteOutlined, EditOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm, Space, Tag, Typography } from 'antd';
import moment from 'moment';
import { useRef } from 'react';

const { Text } = Typography;

// export const ColumnSearchProps = (
//   dataIndex: DataIndex,
//   title: string,
//   setSearchQuery: (query: any) => void,
// ): ColumnType<DataType> => {
//   const searchInput = useRef<InputRef>(null);

//   const handleSearch = (selectedKeys: string, confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
//     if (dataIndex === 'fullname') {
//       setSearchQuery((prev: any) => ({
//         ...prev,
//         name: selectedKeys,
//       }));
//     } else if (dataIndex === 'SaleLevel') {
//       setSearchQuery((prev: any) => ({
//         ...prev,
//         level: selectedKeys,
//       }));
//     } else {
//       setSearchQuery((prev: any) => ({
//         ...prev,
//         [dataIndex]: selectedKeys,
//       }));
//     }
//   };

//   const handleReset = (clearFilters: () => void) => {
//     clearFilters();
//   };

//   return {
//     filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
//       <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
//         <Input
//           ref={searchInput}
//           placeholder={`Tìm kiếm ${title}`}
//           value={selectedKeys[0]}
//           onChange={e => {
//             setSelectedKeys(e.target.value ? [e.target.value] : []);
//             handleSearch(e.target.value, confirm, dataIndex);
//           }}
//           style={{ marginBottom: 8, display: 'block' }}
//         />
//       </div>
//     ),
//     filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
//     onFilterDropdownOpenChange: visible => {
//       if (visible) {
//         setTimeout(() => searchInput.current?.select(), 100);
//       }
//     },
//     render: text => text,
//   };
// };

export const Column = (
  setSearchQuery: (query: string) => void,
  setOpenDrawer: (isOpen: boolean) => void,
  setCustomerSelect: (customer: any) => void,
  useSale: () => {
    deleteNotification: UseMutationResult<any, any, any, unknown>;
  },
  setIsModalOpen: (isOpen: boolean) => void,
  setIdNotification: (id: string) => void,
) => {
  const { deleteNotification } = useSale();
  const columns: ColumnsType<DataType> = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      width: '12%',
      // ...ColumnSearchProps('staff_code', 'mã nhân viên', setSearchQuery),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: '15%',
      // ...ColumnSearchProps('fullname', 'họ tên', setSearchQuery),
    },
    {
      title: 'URL',
      // sorter: true,
      dataIndex: 'extend_url',
      width: '15%',
      // ...ColumnSearchProps('phone_number', 'số điện thoại', setSearchQuery),
    },
    {
      title: 'Ngày tạo',
      // sorter: true,
      dataIndex: 'created_at',
      width: '14%',
      render: (_, record) => <Text>{moment(record?.created_at).format('YYYY/MM/DD')}</Text>,
      // ...ColumnSearchProps('email', 'email', setSearchQuery),
    },
    {
      title: 'Ngày chỉnh sửa',
      dataIndex: 'updated_at',
      width: '14%',
      render: (_, record) => <Text>{moment(record?.updated_at).format('YYYY/MM/DD')}</Text>,
      // ...ColumnSearchProps('role', 'chức vụ', setSearchQuery),
      // filters: [
      //   { text: 'Quản Trị', value: 'admin' },
      //   { text: 'Sale', value: 'sale' },
      //   { text: 'analytics', value: 'Nhân viên Phân tích' },
      //   { text: 'business', value: 'Nhân viên nghiệp vụ' },
      // ],
    },
    {
      title: 'Tình trạng',
      dataIndex: 'is_send',
      width: '8%',
      // ...ColumnSearchProps('SaleLevel', 'level', setSearchQuery),
      // render: (_, record) => <Text>{record?.SaleLevel?.level}</Text>,
      render: (_, record) => (
        <Text>{record?.is_send ? <Tag color="blue">Đã gửi</Tag> : <Tag color="red">Chưa gửi</Tag>}</Text>
      ),
    },
    {
      title: '',
      dataIndex: 'action',
      width: '8%',
      render: (_, record) => (
        <Space size="small">
          {!record?.is_send && (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setIsModalOpen(true);
                setIdNotification(record?.id);
              }}
            >
              <SendOutlined />
            </Button>
          )}
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
          <Popconfirm
            title="Chắc chắn xóa"
            onConfirm={() => {
              deleteNotification.mutate(record?.id);
            }}
          >
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
