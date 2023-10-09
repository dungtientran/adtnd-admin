/* eslint-disable @typescript-eslint/no-unused-vars */
import type { InputRef } from 'antd';
import type { ColumnsType, ColumnType, TablePaginationConfig } from 'antd/es/table';
import type { FilterConfirmProps, FilterValue } from 'antd/es/table/interface';

import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Avatar,
  Button,
  Drawer,
  Input,
  message,
  Popover,
  Skeleton,
  Space,
  Spin,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import qs from 'qs';
import { useEffect, useRef, useState } from 'react';

import { apiUpdateLogoStock, getStockList } from '@/api/stock.api';
import { listCustomerApi } from '@/api/ttd_list_customer';
import MyModal from '@/components/basic/modal';
import MyUpLoad from '@/components/core/upload';

const { Text, Title, Link } = Typography;

interface DataType {
  id: string;
  avatar_url: string;
  fullname: string;
  email: string;
  phone_number: string;
  careby: {
    id: string;
    sale_id: string;
    sale: {
      id: string;
      fullname: string;
      email: string;
      phone_number: string;
      created_date: string;
      updated_date: string;
      avatar_url: string;
      active: boolean;
      role_id: 'string';
    };
  } | null;
  subscription: {
    start_date: string;
    end_date: string;
    id: string;
    subscription_plan: string | null;
    subscription_product: {
      name: string;
      id: string;
    };
  };
  remaining_subscription_day: number;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}
type DataIndex = keyof DataType;

const ListCustomers: React.FC = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [urlLogo, setUrlLogo] = useState<string>('');
  const [recordSelected, setRecordSelected] = useState<any>({});
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [sort, setSort] = useState<string>('');
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [listCustomer, setListCustomer] = useState([]);

  const { getListCustomer } = listCustomerApi;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getListCustomer', tableParams],
    queryFn: () => getListCustomer(qs.stringify(getRandomuserParams(tableParams))),
  });
  const getRandomuserParams = (params: TableParams) => ({
    size: params.pagination?.pageSize,
    page: params.pagination?.current,
    market: params.filters?.market,
    // code: searchText || undefined,
  });
  const updateLogo = useMutation({
    mutationFn: _ => apiUpdateLogoStock(recordSelected?.id, urlLogo),
    onSuccess: _ => {
      queryClient.invalidateQueries(['getListStock']);
      message.success('Update logo thành công');
      setUrlLogo('');
    },
    onError: _ => {
      message.error('Update logo thất bại');
    },
  });

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
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
    // onFilter: (value, record) =>
    //   record[dataIndex]
    //     .toString()
    //     .toLowerCase()
    //     .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: text => text,
  });
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };
  const columns: ColumnsType<DataType> = [
    {
      title: 'Mã',
      dataIndex: 'id',
      // sorter: true,
      width: '14%',
      ...getColumnSearchProps('id'),
    },
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar_url',
      width: '8%',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Avatar
            src={record.avatar_url}
            size="large"
            onClick={() => {
              // setModalOpen(true), setRecordSelected(record);
            }}
          />
        </div>
      ),
    },
    {
      title: 'Tên khách hàng',
      sorter: true,
      dataIndex: 'fullname',
      // width: '20%',
      ...getColumnSearchProps('fullname'),
    },
    {
      title: 'Số điện thoại',
      sorter: true,
      dataIndex: 'phone_number',
      // width: '20%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '8%',
    },
    {
      title: 'Gói dịch vụ',
      dataIndex: 'subscription_product',
      width: '8%',
      filters: [
        { text: 'Hose', value: 'HOSE' },
        { text: 'Hnx', value: 'HNX' },
        { text: 'Upcom', value: 'UPCOM' },
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
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <Text strong>{record.careby.sale.fullname}</Text>
              <Tooltip title="Click để thay đổi" placement="right">
                <Link>Thay đổi</Link>
              </Tooltip>
            </div>
          ) : (
            <Tooltip title="Click để thêm nhân viên" placement="right">
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  setRecordSelected(record);
                }}
              >
                Assign
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      // setData([]);
    }

    if (sorter.order === 'ascend') {
      const sorte = `${sorter.field}_order=ASC`;

      setSort(sorte);
    } else if (sorter.order === 'descend') {
      const sorte = `${sorter.field}_order=DESC`;

      setSort(sorte);
    }
  };

  const handleUpdateLogo = async () => {
    updateLogo.mutate();
    setUrlLogo('');
  };

  useEffect(() => {
    if (data) {
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: data?.data?.count,
        },
      });
      setListCustomer(data?.data?.rows);
    }
  }, [data]);

  // console.log(tableParams);
  // console.log('sort______________', sort);
  return (
    <div className="aaa">
      <div style={{ textAlign: 'center' }}>
        <Typography.Title level={2}>Danh sách khách hàng</Typography.Title>
      </div>
      <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'center' }}>
        <Button onClick={showDrawer} className='hover:bg-[#FF6E00] hover:text-white'>
          <Typography><PlusOutlined /> Tạo mới người dùng</Typography>
        </Button>
      </div>
      <div style={{ marginBottom: '10px' }}>
        {data?.count && !searchText ? (
          <Typography.Text>
            Có tất cả <Typography.Text strong>{data?.count || 0}</Typography.Text> kết quả
          </Typography.Text>
        ) : (
          ''
        )}
        {searchText && (
          <Typography.Text>
            Kết quả tìm kiếm cho <Typography.Text strong>{searchText}</Typography.Text>
          </Typography.Text>
        )}
      </div>
      <Table
        columns={columns}
        rowSelection={{
          ...rowSelection,
        }}
        rowKey={record => record.id}
        dataSource={listCustomer}
        pagination={tableParams.pagination}
        loading={isLoading}
        onChange={handleTableChange}
        scroll={{ x: 'max-content', y: '100%' }}
      />
      <Drawer
        title="Tạo mới người dùng"
        width={400}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={onClose} type="primary">
              Submit
            </Button>
          </Space>
        }
      ></Drawer>
    </div>
  );
};

export default ListCustomers;
