import type { TableParams } from './index.interface';

import './index.less';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Drawer, message, Table } from 'antd';
import qs from 'qs';
import { useEffect, useState } from 'react';

import { listUserApi } from '@/api/ttd_user_management';
import EditUserManagement from '@/pages/components/form/form-edit-user-manage';
import HeadTitle from '@/pages/components/head-title/HeadTitle';
import Result from '@/pages/components/result/Result';

import { Column } from './columns';

const { getListUser, createSale, updateSale } = listUserApi;

const UserManagement: React.FC = () => {
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
  const [customerSelect, setCustomerSelect] = useState<any>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getListUser', queryFilter, searchText, tableParams],
    queryFn: () => getListUser(qs.stringify(getRandomuserParams(tableParams)), queryFilter, qs.stringify(searchText)),
  });

  const getRandomuserParams = (params: TableParams) => ({
    size: params.pagination?.pageSize,
    page: params.pagination?.current,
    role: params.filters?.role?.join(','),
  });

  const onClose = () => {
    setOpen(false);
  };

  const useSale = () => {
    const create = useMutation(createSale, {
      onSuccess: () => {
        queryClient.invalidateQueries(['getListCustomer']);
        message.success('Tạo thành công');
        setOpen(false);
      },
      onError: (err: any) => {
        message.error(`${err?.message}` || 'Tạo thất bại');
      },
    });
    const update = useMutation(updateSale, {
      onSuccess: () => {
        queryClient.invalidateQueries(['getListCustomer']);
        message.success('Update thành công');
        setOpen(false);
      },
      onError: (err: any) => {
        message.error(`${err?.message}` || 'Update thất bại');
      },
    });

    return { create, update };
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

  useEffect(() => {
    if (data) {
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: data?.data?.count,
        },
      });
      setListCustomerSp(data?.data?.rows);
    }
  }, [data]);

  return (
    <div className="aaa">
      <HeadTitle title="Danh sách quản trị viên" />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button
          type="primary"
          onClick={() => {
            setOpen(true), setCustomerSelect(undefined);
          }}
        >
          Tạo quản trị viên mới
        </Button>
      </div>
      <Result total={data?.data?.count} searchText={searchedColumn} isButtonExcel={false} />
      <div className="table_user">
        <Table
          columns={Column(setSearchText, setOpen, setCustomerSelect)}
          rowKey={record => record.id}
          dataSource={listCustomerSp}
          pagination={tableParams.pagination}
          // loading={isLoading}
          onChange={handleTableChange}
          scroll={{ x: 'max-content', y: '100%' }}
          style={{ height: 'auto' }}
        />
      </div>
      <Drawer
        title={!customerSelect ? 'Tạo mới quản trị viên' : 'Update level '}
        width={360}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <EditUserManagement initForm={customerSelect} useSale={useSale} />
      </Drawer>
    </div>
  );
};

export default UserManagement;
