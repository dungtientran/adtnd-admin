/* eslint-disable @typescript-eslint/no-unused-vars */
import type { InputRef } from 'antd';
import type { ColumnsType, ColumnType, TablePaginationConfig } from 'antd/es/table';
import type { FilterConfirmProps, FilterValue } from 'antd/es/table/interface';

import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Avatar, Button, Input, message, Select, Skeleton, Space, Spin, Table, Tooltip, Typography } from 'antd';
import qs from 'qs';
import { useEffect, useRef, useState } from 'react';

import { apiListStock, apiUpdateLogoStock } from '@/api/stock.api';
import MyModal from '@/components/basic/modal';
import MyUpLoad from '@/components/core/upload';
import SearchSuggest from '@/pages/components/search-suggest';

const { getStockList } = apiListStock;

interface DataType {
  id: string;
  code: string;
  en_name: string;
  logo_url: string;
  market: string;
  name: string;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}
type DataIndex = keyof DataType;

const Recommendations: React.FC = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
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
  // const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [listStock, setListStock] = useState([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getListStock', tableParams, sort, searchText],
    queryFn: () => getStockList(qs.stringify(getRandomuserParams(tableParams)), sort, searchText),
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
      setModalOpen(false);
      message.success('Update logo thành công');
      setUrlLogo('');
    },
    onError: _ => {
      message.error('Update logo thất bại');
    },
  });

  const handleSearch = (selectedKeys: string, confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
    // confirm();
    setSearchText(selectedKeys);

    switch (dataIndex) {
      case 'code':
        setSearchText(`code=${selectedKeys}`);
        break;
      case 'name':
        setSearchText(`name=${selectedKeys}`);
        break;
      case 'en_name':
        setSearchText(`en_name=${selectedKeys}`);
        break;
      default:
        break;
    }
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
            Đóng
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: text => text,
  });
  // const getColumnSearchSuggestProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
  //   filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
  //     <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
  //       <SearchSuggest />
  //       <Space size="large">
  //         <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
  //           Reset
  //         </Button>
  //         <Button
  //           type="link"
  //           size="small"
  //           onClick={() => {
  //             close();
  //           }}
  //         >
  //           Đóng
  //         </Button>
  //       </Space>
  //     </div>
  //   ),
  //   filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
  //   onFilter: (value, record) =>
  //     record[dataIndex]
  //       .toString()
  //       .toLowerCase()
  //       .includes((value as string).toLowerCase()),
  //   onFilterDropdownOpenChange: visible => {
  //     if (visible) {
  //       setTimeout(() => searchInput.current?.select(), 100);
  //     }
  //   },
  //   render: text => text,
  // });

  const columns: ColumnsType<DataType> = [
    {
      title: 'Thị trường',
      dataIndex: 'market',
      sorter: true,
      filters: [
        { text: 'Hose', value: 'HOSE' },
        { text: 'Hnx', value: 'HNX' },
        { text: 'Upcom', value: 'UPCOM' },
      ],
      width: '20%',
    },
    {
      title: 'Mã cổ phiếu',
      dataIndex: 'code',
      sorter: true,
      width: '20%',
      ...getColumnSearchProps('code'),
    },
    {
      title: 'Tên công ty (tiếng Việt)',
      sorter: true,
      dataIndex: 'name',
      width: '20%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Tên công ty (tiếng Anh)',
      sorter: true,
      dataIndex: 'en_name',
      width: '20%',
      ...getColumnSearchProps('en_name'),
    },
    {
      title: 'Logo',
      dataIndex: 'logo_url',
      key: 'logo_url',
      width: '20%',

      render: (_, record) => (
        <Space size="middle">
          {record.logo_url ? (
            <Tooltip title="Click để thay đổi" placement="right">
              <Avatar
                src={record.logo_url}
                size="large"
                onClick={() => {
                  setModalOpen(true), setRecordSelected(record);
                }}
                style={{ cursor: 'pointer' }}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Click để thêm logo" placement="right">
              <Button
                type="primary"
                onClick={() => {
                  setModalOpen(true), setRecordSelected(record);
                }}
              >
                <PlusOutlined />
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
      setListStock(data?.data?.rows);
    }
  }, [data]);

  // console.log(tableParams);
  // console.log('sort______________', sort);
  // console.log('search_____', searchText);
  // console.log('listStock_', listStock);
  // console.log('searchedColumn__________', searchedColumn);
  return (
    <div className="aaa">
      <div style={{ textAlign: 'center' }}>
        <Typography.Title level={2}>Danh mục cổ phiếu</Typography.Title>
      </div>
      <div style={{ marginBottom: '10px' }}>
        {data?.data?.count && (
          <Typography.Text>
            Có tất cả <Typography.Text strong>{data?.data?.count?.toLocaleString()}</Typography.Text> kết quả
            {searchText && (
              <Typography.Text>
                {' '}
                tìm kiếm cho <Typography.Text strong>{searchText}</Typography.Text>
              </Typography.Text>
            )}
          </Typography.Text>
        )}
      </div>
      <Table
        columns={columns}
        rowKey={record => record.id}
        dataSource={listStock}
        pagination={tableParams.pagination}
        loading={isLoading}
        onChange={handleTableChange}
        scroll={{ x: 'max-content', y: '100%' }}
      />
      <MyModal
        title="Cập nhật logo"
        centered
        open={modalOpen}
        onOk={handleUpdateLogo}
        onCancel={() => setModalOpen(false)}
        okButtonProps={{ disabled: !urlLogo && true }}
      >
        <Spin spinning={updateLogo.isLoading}>
          <MyUpLoad setUrlLogo={setUrlLogo} record={recordSelected} />
        </Spin>
      </MyModal>
    </div>
  );
};

export default Recommendations;
