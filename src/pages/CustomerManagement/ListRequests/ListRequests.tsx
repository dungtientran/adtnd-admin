/* eslint-disable @typescript-eslint/no-unused-vars */
import type { TableParams } from './index.interface';

import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Drawer, message, Table } from 'antd';
import qs from 'qs';
import { useEffect, useState } from 'react';

import { listCustomerApi } from '@/api/ttd_list_customer';
import BoxFilterListCustomer from '@/pages/components/box-filter/BoxFilterListCustomer';
import CreateUser from '@/pages/components/form-add-user';
import HeadTitle from '@/pages/components/head-title/HeadTitle';
import Result from '@/pages/components/result/Result';

import BoxFilter from './boxFilter';
import { Column } from './columns';

const { getListCustomer, createCustomer } = listCustomerApi;

const ListRequests: React.FC = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [sort, setSort] = useState<string>('');
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [listCustomer, setListCustomer] = useState([]);
  const [newCustomer, setNewCustomer] = useState<any>();
  const [customerSelect, setCustomerSelect] = useState<any>();
  // const { data, isLoading, isError } = useQuery({
  //   queryKey: ['getListCustomer', tableParams, searchText],
  //   queryFn: () => getListCustomer(qs.stringify(getRandomuserParams(tableParams)), searchText),
  // });
  const getRandomuserParams = (params: TableParams) => ({
    size: params.pagination?.pageSize,
    page: params.pagination?.current,
    subscriptions: params.filters?.subscription_product?.join(','),
  });

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

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

  // useEffect(() => {
  //   if (data) {
  //     setTableParams({
  //       ...tableParams,
  //       pagination: {
  //         ...tableParams.pagination,
  //         total: data?.data?.count,
  //       },
  //     });
  //     setListCustomer(data?.data?.rows);
  //   }
  // }, [data]);

  return (
    <div className="aaa">
      <HeadTitle title="Danh sách yêu cầu hỗ trợ" />
      <BoxFilter />
      <Result
        // total={data?.data?.count}
        searchText={searchedColumn}
      />
      <Table
        columns={Column(setSearchText, setSearchedColumn, setOpen, setCustomerSelect)}
        rowKey={record => record.id}
        dataSource={listCustomer}
        pagination={tableParams.pagination}
        // loading={isLoading}
        onChange={handleTableChange}
        scroll={{ x: 'max-content', y: '100%' }}
      />
      <Drawer title="Tạo mới người dùng" width={360} onClose={onClose} open={open} bodyStyle={{ paddingBottom: 80 }}>
        {/* <CreateUser setCustomerForm={setNewCustomer} initForm={customerSelect} setSaleCustomer={setSa}/> */}
      </Drawer>
    </div>
  );
};

export default ListRequests;
