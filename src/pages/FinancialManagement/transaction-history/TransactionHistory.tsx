import type { DataType, InitDataType, TableParams } from './index.interface';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Table } from 'antd';
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
    },
  });
  const [sort, setSort] = useState<string>('');
  const [searchText, setSearchText] = useState({});
  const [searchedColumn, setSearchedColumn] = useState('');
  const [listCustomerSp, setListCustomerSp] = useState([]);
  const [queryFilter, setQueryFilter] = useState<string>('');
  const [customerSelect, setCustomerSelect] = useState<any>();
  const [idDelete, setIdDelete] = useState<string>('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getListTransactionHistory', tableParams, queryFilter],
    queryFn: () => getListTransactionHistory(qs.stringify(getRandomuserParams(tableParams)), queryFilter),
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

    // if (sorter.order === 'ascend') {
    //   const sorte = `${sorter.field}_order=ASC`;

    //   setSort(sorte);
    // } else if (sorter.order === 'descend') {
    //   const sorte = `${sorter.field}_order=DESC`;

    //   setSort(sorte);
    // }
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
          amount: item.amount,
          customer_id: item.customer_id,
          created_at: item.created_at,
          description: item.description,
          name: item.customer.fullname,
          email: item.customer.email,
          phone_number: item.customer.phone_number,
          package: `${item.subscription_plan.subscription_product.name} ${item.subscription_plan.name}`,
        };

        return b;
      });

      setListCustomerSp(newArr);

      console.log('newArr____________', newArr);
    }
  }, [data]);
  console.log('data________________', data);

  return (
    <div className="aaa">
      <HeadTitle title="Lịch sử giao dịch" />
      <BoxFilter setQueryFilter={setQueryFilter} />
      <Result total={data?.data?.count} searchText={searchedColumn} />
      <Table
        columns={Column(setSearchText, setOpen, setCustomerSelect, setIdDelete)}
        rowKey={record => record.id}
        dataSource={listCustomerSp}
        pagination={tableParams.pagination}
        // loading={isLoading}
        onChange={handleTableChange}
        scroll={{ x: 'max-content', y: '100%' }}
      />
    </div>
  );
};

export default TransactionHistory;
