/* eslint-disable @typescript-eslint/no-unused-vars */
import type { TableParams } from './index.interface';

import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Drawer, message, Table } from 'antd';
import qs from 'qs';
import { useEffect, useState } from 'react';

import { listContractApi } from '@/api/ttd_contract';
import { listCustomerApi } from '@/api/ttd_list_customer';
import CreateContract from '@/pages/components/form/form-contract';
import EditRequest from '@/pages/components/form/form-edit-request';
import HeadTitle from '@/pages/components/head-title/HeadTitle';
import Result from '@/pages/components/result/Result';

import BoxFilter from './boxFilter';
import { Column } from './columns';

const { getCustomerSupport, updateCustomerSupport, deleteCustomerSupport } = listCustomerApi;
const { getListContract, createContract } = listContractApi;

const InterestRate: React.FC = () => {
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
  const [listCustomerSp, setListCustomerSp] = useState([]);
  const [newContract, setNewContract] = useState<any>();

  const [queryFilter, setQueryFilter] = useState<string>('');
  const [updateDataSp, setUpdateDataSp] = useState<any>();
  const [customerSelect, setCustomerSelect] = useState<any>();
  const [idDelete, setIdDelete] = useState<string>('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getListContract', tableParams, queryFilter, searchText],
    queryFn: () => getListContract(),
  });

  const update = useMutation({
    mutationFn: _ => updateCustomerSupport(customerSelect?.id as string, updateDataSp),
    onSuccess: _ => {
      queryClient.invalidateQueries(['getListContract']);
      message.success('Update thành công');
      setUpdateDataSp(undefined);
      setOpen(false);
    },
    onError: _ => {
      message.error('Update thất bại');
    },
  });
  const create = useMutation({
    mutationFn: _ => createContract(newContract),
    onSuccess: _ => {
      queryClient.invalidateQueries(['getListContract']);
      message.success('Tạo hợp đồng thành công');
      setNewContract(undefined);
      setOpen(false);
    },
    onError: _ => {
      message.error('Tạo hợp đồng thất bại');
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
    if (newContract) {
      create.mutate();
    }
  }, [newContract]);

  return (
    <div className="aaa">
      <HeadTitle title="Quản lý hợp đồng Vip" />
      <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'center' }}>
        <Button
          onClick={() => {
            setOpen(true);
            setNewContract(undefined);
          }}
          type="primary"
        >
          <PlusOutlined /> Thêm hợp đồng
        </Button>
      </div>
      <BoxFilter setQueryFilter={setQueryFilter} />
      <Result total={data?.data?.count} />
      <Table
        columns={Column(setSearchText, setOpen, setCustomerSelect, setIdDelete)}
        rowKey={record => record.id}
        dataSource={listCustomerSp}
        pagination={tableParams.pagination}
        // loading={isLoading}
        onChange={handleTableChange}
        scroll={{ x: 'max-content', y: '100%' }}
      />
      <Drawer title="Thêm hợp đồng" width={360} onClose={onClose} open={open} bodyStyle={{ paddingBottom: 80 }}>
        <CreateContract setUpdateDataSp={setUpdateDataSp} initForm={customerSelect} setNewContract={setNewContract} />
      </Drawer>
    </div>
  );
};

export default InterestRate;
