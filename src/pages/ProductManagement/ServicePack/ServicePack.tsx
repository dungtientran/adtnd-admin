/* eslint-disable @typescript-eslint/no-unused-vars */
import type { InputRef } from 'antd';
import type { ColumnsType, ColumnType, TablePaginationConfig } from 'antd/es/table';
import type { FilterConfirmProps, FilterValue } from 'antd/es/table/interface';

// import './index.less';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Avatar, Button, Input, message, Select, Skeleton, Space, Spin, Table, Tag, Tooltip, Typography } from 'antd';
import qs from 'qs';
import { useEffect, useRef, useState } from 'react';

import { apiListStock } from '@/api/stock.api';
import { listServerPackApi } from '@/api/ttd_server_pack';
import MyModal from '@/components/basic/modal';
import MyUpLoad from '@/components/core/upload';
import HeadTitle from '@/pages/components/head-title/HeadTitle';
import Result from '@/pages/components/result/Result';

const { getStockList } = apiListStock;
const { getList } = listServerPackApi;

const LIMIT = Number(import.meta.env.VITE_PAGE_SIZE);

interface DataType {
  id: string;
  min_cost: number;
  name: string;
  description: string;
  trial: boolean;
  trial_duration: number;
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
      showSizeChanger: true,
      pageSizeOptions: [10, 20, 50],
    },
  });
  const [sort, setSort] = useState<string>('');
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [listStock, setListStock] = useState([]);
  const [excelData, setExcelData] = useState([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getListServerPack', tableParams, sort, searchText],
    queryFn: () => getList(),
  });
  const getRandomuserParams = (params: TableParams) => ({
    size: params.pagination?.pageSize,
    page: params.pagination?.current,
    market: params.filters?.market,
    // code: searchText || undefined,
  });

  const handleReset = () => {
    setSort('');
    setSearchText('');
    setTableParams({
      pagination: {
        current: 1,
      },
    });
  };

  const columns: ColumnsType<DataType> = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   width: '20%',
    // },
    {
      title: 'Gói dịch vụ',
      dataIndex: 'name',
      width: '20%',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: '20%',
    },
    {
      title: 'Tình trạng',
      width: '20%',
      render: (_, record) => <Tag color="blue">Đang hoạt động</Tag>,
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

  useEffect(() => {
    if (data) {
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: data?.data?.count,
        },
      });

      setListStock(data?.data);
    }
  }, [data]);

  useEffect(() => {
    if (isLoading) setExcelData([]);
  }, [isLoading]);

  // console.log(tableParams);
  // console.log('sort______________', sort);
  // console.log('search_____', searchText);
  // console.log('listStock_', listStock);
  // console.log('searchedColumn__________', searchedColumn);
  // console.log('excelData________________', excelData);

  return (
    <div className="aaa">
      <HeadTitle title="Gói dịch vụ" />
      <Result total={data?.data?.count} columns={columns} dataSource={excelData} title="Danh mục cổ phiếu" />
      <div className="table_stock">
        <Table
          columns={columns}
          rowKey={record => record.id}
          dataSource={listStock}
          // pagination={tableParams.pagination}
          pagination={false}
          // loading={isLoading}
          onChange={handleTableChange}
          scroll={{ x: 'max-content', y: '100%' }}
        />
      </div>
    </div>
  );
};

export default Recommendations;
