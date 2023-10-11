import type { TableParams } from './index.interface';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Drawer, message, Table } from 'antd';
import qs from 'qs';
import { useEffect, useState } from 'react';

import { listCustomerApi } from '@/api/ttd_list_customer';
import { listUserApi } from '@/api/ttd_user_management';
import EditUserManagement from '@/pages/components/form/form-edit-user-manage';
import HeadTitle from '@/pages/components/head-title/HeadTitle';
import Result from '@/pages/components/result/Result';

import { Column } from './columns';

const { getCustomerSupport, updateCustomerSupport, deleteCustomerSupport } = listCustomerApi;
const { getListUser } = listUserApi;

const UserManagement: React.FC = () => {
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
  const [updateDataSp, setUpdateDataSp] = useState<any>();
  const [customerSelect, setCustomerSelect] = useState<any>();
  const [idDelete, setIdDelete] = useState<string>('');
  const { data, isLoading, isError } = useQuery({
    queryKey: ['getListUser', tableParams, queryFilter, searchText],
    queryFn: () => getListUser(qs.stringify(getRandomuserParams(tableParams)), queryFilter),
  });
  const update = useMutation({
    mutationFn: _ => updateCustomerSupport(customerSelect?.id as string, updateDataSp),
    onSuccess: _ => {
      queryClient.invalidateQueries(['getListCustomer']);
      message.success('Update thành công');
      setUpdateDataSp(undefined);
      setOpen(false);
    },
    onError: _ => {
      message.error('Update thất bại');
    },
  });
  const deleteRequest = useMutation({
    mutationFn: _ => deleteCustomerSupport(idDelete),
    onSuccess: _ => {
      queryClient.invalidateQueries(['getListCustomer']);
      message.success('Xóa thành công');
      setUpdateDataSp(undefined);
      setOpen(false);
    },
    onError: _ => {
      message.error('Xóa thất bại');
    },
  });

  const getRandomuserParams = (params: TableParams) => ({
    size: params.pagination?.pageSize,
    page: params.pagination?.current,
    subscriptions: params.filters?.subscription_product?.join(','),
  });

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

  useEffect(() => {
    if (updateDataSp) {
      update.mutate();
    }
  }, [updateDataSp]);

  useEffect(() => {
    if (idDelete) {
      deleteRequest.mutate();
    }
  }, [idDelete]);
  // console.log('data_______________________', data);

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
      <Drawer title="Tạo mới quản trị viên" width={360} onClose={onClose} open={open} bodyStyle={{ paddingBottom: 80 }}>
        <EditUserManagement setCustomerForm={setUpdateDataSp} initForm={customerSelect} />
      </Drawer>
    </div>
  );
};

export default UserManagement;
