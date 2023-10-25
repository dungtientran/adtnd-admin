import type { DataType, InitDataType, TableParams } from './index.interface';

import './index.less';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message, Table } from 'antd';
import qs from 'qs';
import { useEffect, useState } from 'react';

import { listTransactionApi } from '@/api/ttd.transaction';
import HeadTitle from '@/pages/components/head-title/HeadTitle';
import Result from '@/pages/components/result/Result';

import BoxFilter from './boxFilter';
import { Column } from './columns';

const { getListTransactionHistory } = listTransactionApi;

const TransactionHistory = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: [10, 20, 50],
    },
  });
  const [sort, setSort] = useState<string>('');
  const [searchText, setSearchText] = useState({});
  const [searchedColumn, setSearchedColumn] = useState('');
  const [listCustomerSp, setListCustomerSp] = useState([]);
  const [queryFilter, setQueryFilter] = useState<string>('');
  const [dataExcel, setDataExcel] = useState([]);
  const [customerSelect, setCustomerSelect] = useState<any>();
  const [idDelete, setIdDelete] = useState<string>('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getListTransactionHistory', tableParams, queryFilter, searchText, sort],
    queryFn: () =>
      getListTransactionHistory(
        qs.stringify(getRandomuserParams(tableParams)),
        queryFilter,
        qs.stringify(searchText),
        sort,
      ),
  });

  const getRandomuserParams = (params: TableParams) => ({
    size: params.pagination?.pageSize,
    page: params.pagination?.current,
    subscriptions: params.filters?.subscription_product?.join(','),
  });

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

  const getExcelData = async (limit: string) => {
    try {
      const res = await getListTransactionHistory(` page=1&size=${limit}`, queryFilter, qs.stringify(searchText), sort);

      if (res?.code === 200) {
        // console.log('columns__________________', columns);
        const newArr = res?.data?.rows?.map((item: InitDataType) => {
          const b = {
            id: item.id,
            amount: item?.amount,
            customer_code: item?.customer?.customer_code,
            created_at: item?.created_at,
            description: item?.description,
            name: item?.customer?.fullname,
            email: item?.customer?.email,
            phone_number: item?.customer?.phone_number,
            package:
              item.subscription_plan?.subscription_product?.name &&
              item?.subscription_plan?.name &&
              `${item.subscription_plan?.subscription_product?.name} ${item?.subscription_plan?.name}`,
          };

          return b;
        });

        setDataExcel(newArr);
      } else {
        message.warning('Lỗi khi xuất dữ liệu');
      }
    } catch (error) {
      console.log(error);
      message.error('Lỗi server');
    }
  };

  const handleSetPageOnFilter = () => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
    });
  };

  const handleResetFilter = () => {
    setQueryFilter('');
    setSearchText({});
    setSort('');
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
      const newArr = data?.data?.rows?.map((item: InitDataType) => {
        const b = {
          id: item.id,
          amount: item?.amount,
          customer_code: item?.customer?.customer_code,
          created_at: item?.created_at,
          description: item?.description,
          name: item?.customer?.fullname,
          email: item?.customer?.email,
          phone_number: item?.customer?.phone_number,
          package:
            item.subscription_plan?.subscription_product?.name &&
            item?.subscription_plan?.name &&
            `${item.subscription_plan?.subscription_product?.name} ${item?.subscription_plan?.name}`,
        };

        return b;
      });

      getExcelData(data?.data?.count);
      setListCustomerSp(newArr);
    }
  }, [data]);

  return (
    <div className="aaa">
      <HeadTitle title="Lịch sử giao dịch" />
      <BoxFilter
        setQueryFilter={setQueryFilter}
        handleSetPageOnFilter={handleSetPageOnFilter}
        handleResetFilters={handleResetFilter}
      />
      <Result
        total={tableParams.pagination?.total}
        searchText={searchedColumn}
        columns={Column(setSearchText, setOpen, setCustomerSelect, setIdDelete)}
        dataSource={dataExcel}
        title="Lịch sử giao dịch"
      />
      <div className="table_transaction_history">
        <Table
          columns={Column(setSearchText, setOpen, setCustomerSelect, setIdDelete)}
          rowKey={record => record.id}
          dataSource={listCustomerSp}
          pagination={tableParams.pagination}
          // loading={isLoading}
          onChange={handleTableChange}
          scroll={{ x: 'max-content', y: '100%' }}
          style={{ height: 'auto' }}
        />
      </div>
    </div>
  );
};

export default TransactionHistory;
