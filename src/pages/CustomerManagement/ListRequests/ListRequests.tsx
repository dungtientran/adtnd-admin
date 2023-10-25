/* eslint-disable @typescript-eslint/no-unused-vars */
import type { TableParams } from './index.interface';

import './index.less';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Drawer, message, Table } from 'antd';
import qs from 'qs';
import { useEffect, useState } from 'react';

import { listCustomerApi } from '@/api/ttd_list_customer';
import EditRequest from '@/pages/components/form/form-edit-request';
import HeadTitle from '@/pages/components/head-title/HeadTitle';
import Result from '@/pages/components/result/Result';

import BoxFilter from './boxFilter';
import { Column } from './columns';

const { getCustomerSupport, updateCustomerSupport, deleteCustomerSupport } = listCustomerApi;

const ListRequests: React.FC = () => {
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
  const [updateDataSp, setUpdateDataSp] = useState<any>();
  const [customerSelect, setCustomerSelect] = useState<any>();
  const [idDelete, setIdDelete] = useState<string>('');
  const [dataExcel, setDataExcel] = useState([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getListCustomer', tableParams, queryFilter, searchText],
    queryFn: () =>
      getCustomerSupport(qs.stringify(getRandomuserParams(tableParams)), queryFilter, qs.stringify(searchText)),
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

  const handleSetPageOnFilter = () => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
    });
  };

  const getExcelData = async (limit: string) => {
    try {
      const res = await getCustomerSupport(` page=1&size=${limit}`, qs.stringify(searchText), queryFilter);

      if (res?.code === 200) {
      
        // console.log('columns__________________', columns);

        setDataExcel(res?.data?.rows);
      } else {
        message.warning('Lỗi khi xuất dữ liệu');
      }
    } catch (error) {
      console.log(error);
      message.error('Lỗi server');
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
      getExcelData(data?.data?.count);
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

  return (
    <div className="aaa">
      <HeadTitle title="Danh sách yêu cầu hỗ trợ" />
      <BoxFilter
        setQueryFilter={setQueryFilter}
        setSearchText={setSearchText}
        handleSetPageOnFilter={handleSetPageOnFilter}
      />
      <Result
        total={data?.data?.count}
        searchText={searchedColumn}
        dataSource={dataExcel}
        columns={Column(setSearchText, setOpen, setCustomerSelect, setIdDelete)}
        title="Danh sách yêu cầu hỗ trợ"
      />
      <div className="table_list_resquet">
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
      <Drawer title="Chỉnh sửa" width={360} onClose={onClose} open={open} bodyStyle={{ paddingBottom: 80 }}>
        <EditRequest setUpdateDataSp={setUpdateDataSp} initForm={customerSelect} />
      </Drawer>
    </div>
  );
};

export default ListRequests;
