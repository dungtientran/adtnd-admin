/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ColumnListCustomerType, DataType, TableParams } from './index.interface';

import './index.less';

import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Drawer, message, Table } from 'antd';
import qs from 'qs';
import { useEffect, useState } from 'react';

import { listCustomerApi } from '@/api/ttd_list_customer';
import BoxFilterListCustomer from '@/pages/components/box-filter/BoxFilterListCustomer';
import ExportExcel from '@/pages/components/button-export-excel/ExportExcel';
import CreateUser from '@/pages/components/form/form-add-user';
import HeadTitle from '@/pages/components/head-title/HeadTitle';
import Result from '@/pages/components/result/Result';

import { Column } from './columns';

const { getListCustomer, createCustomer, addSaleCustomer, removeSaleCustomer } = listCustomerApi;

const ListCustomers: React.FC = () => {
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
  const [queryFilter, setQuerFilter] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [listCustomer, setListCustomer] = useState([]);
  const [newCustomer, setNewCustomer] = useState<any>();
  const [sale, setSale] = useState<any>();

  const [customerSelect, setCustomerSelect] = useState<any>();
  const [customer_id, setCustomer_id] = useState<string>('');

  const [dataExcel, setDataExcel] = useState([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getListCustomer', tableParams, queryFilter, searchText, sort],
    queryFn: () =>
      getListCustomer(qs.stringify(getRandomuserParams(tableParams)), qs.stringify(searchText), queryFilter, sort),
  });

  const getExcelData = async (limit: string) => {
    try {
      const res = await getListCustomer(` page=1&size=${limit}`, qs.stringify(searchText), queryFilter, sort);

      if (res?.code === 200) {
        const columnsExcel = res?.data?.rows?.map((item: DataType) => {
          const column: ColumnListCustomerType = {
            avatar_url: item?.avatar_url,
            customer_code: item?.customer_code,
            email: item?.email,
            nav: item?.CaculatorHistories?.expected_amount,
            fullname: item?.fullname,
            id: item?.id,
            phone_number: item?.phone_number,
            day_remaining: item?.remaining_subscription_day,
            sale_name: item?.careby?.sale?.fullname,
            subscription_product: item?.subscription?.subscription_product?.name,
          };

          return column;
        });

        // console.log('columns__________________', columns);

        setDataExcel(columnsExcel);
      } else {
        message.warning('Lỗi khi xuất dữ liệu');
      }
    } catch (error) {
      console.log(error);
      message.error('Lỗi server');
    }
  };

  const getRandomuserParams = (params: TableParams) => ({
    size: params.pagination?.pageSize,
    page: params.pagination?.current,
    subscriptions: params.filters?.subscription_product?.join(','),
  });
  const createNewCustomer = useMutation({
    mutationFn: _ => createCustomer(newCustomer),
    onSuccess: _ => {
      queryClient.invalidateQueries(['getListCustomer']);
      message.success('Tạo người dùng mới thành công');
      setNewCustomer(undefined);
      setOpen(false);
    },
    onError: _ => {
      message.error('Tạo người dùng mới thất bại');
      console.log(createNewCustomer.error);
    },
  });
  const addSaleUser = useMutation({
    mutationFn: _ => addSaleCustomer(sale),
    onSuccess: _ => {
      queryClient.invalidateQueries(['getListCustomer']);
      message.success('Thêm nhân viên hỗ trợ thành công');
      setSale(undefined);
      setOpen(false);
    },
    onError: data => {
      message.error('Thêm nhân viên hỗ trợ thất bại');
      console.log('eror________', data);
    },
  });
  const remoteSaleUser = useMutation({
    mutationFn: _ => removeSaleCustomer(customer_id),
    onSuccess: _ => {
      queryClient.invalidateQueries(['getListCustomer']);
      message.success('Xóa nhân viên hỗ trợ thành công');
      setSale(undefined);
      setOpen(false);
    },
    onError: data => {
      message.error('Xóa nhân viên hỗ trợ thất bại');
      console.log('eror________', data);
    },
  });

  const showDrawer = () => {
    setCustomerSelect(undefined);
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
    // console.log('filters__________________', filters);

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

  const handleClearFilter = () => {
    setSearchText({});
    setQuerFilter('');
  };

  useEffect(() => {
    if (data) {
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: data?.data?.count,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
        },
      });
      const columns = data?.data?.rows?.map((item: DataType) => {
        const column: ColumnListCustomerType = {
          avatar_url: item?.avatar_url,
          customer_code: item?.customer_code,
          email: item?.email,
          nav: item?.CaculatorHistories?.expected_amount,
          fullname: item?.fullname,
          id: item?.id,
          phone_number: item?.phone_number,
          day_remaining: item?.remaining_subscription_day,
          sale_name: item?.careby?.sale?.fullname,
          subscription_product: item?.subscription?.subscription_product?.name,
        };

        return column;
      });
      // const columnsExcel = excelData.data?.data?.rows?.map((item: DataType) => {
      //   const column: ColumnListCustomerType = {
      //     avatar_url: item?.avatar_url,
      //     customer_code: item?.customer_code,
      //     email: item?.email,
      //     nav: item?.CaculatorHistories?.expected_amount,
      //     fullname: item?.fullname,
      //     id: item?.id,
      //     phone_number: item?.phone_number,
      //     day_remaining: item?.remaining_subscription_day,
      //     sale_name: item?.careby?.sale?.fullname,
      //     subscription_product: item?.subscription?.subscription_product?.name,
      //   };

      //   return column;
      // });
      // console.log('columns__________________', columns);

      // setDataExcel(columnsExcel);
      setListCustomer(columns);
      getExcelData(data?.data?.count as string);
      // setDataExcel();
    }
  }, [data]);

  useEffect(() => {
    if (newCustomer) {
      createNewCustomer.mutate();
    }
  }, [newCustomer]);
  useEffect(() => {
    if (sale) {
      addSaleUser.mutate();
    }
  }, [sale]);
  useEffect(() => {
    if (customer_id) {
      remoteSaleUser.mutate();
    }
  }, [customer_id]);

  // console.log('excelData_____________', dataExcel);

  return (
    <div className="aaa">
      <HeadTitle title="Danh sách khách hàng" />
      <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'center' }}>
        <Button onClick={showDrawer} type="primary">
          <PlusOutlined /> Tạo mới người dùng
        </Button>
      </div>
      <BoxFilterListCustomer
        setQueryFiter={setQuerFilter}
        queryFilter={queryFilter}
        searchText={qs.stringify(searchText)}
        clearFilter={handleClearFilter}
      />
      <Result
        total={data?.data?.count}
        searchText={searchedColumn}
        columns={Column(setSearchText, setSearchedColumn, setOpen, setCustomerSelect, setCustomer_id)}
        dataSource={dataExcel}
      />
      <div className="table_list_customer">
        <Table
          columns={Column(setSearchText, setSearchedColumn, setOpen, setCustomerSelect, setCustomer_id)}
          rowKey={record => record.id}
          dataSource={listCustomer}
          pagination={tableParams.pagination}
          // loading={isLoading}
          onChange={handleTableChange}
          scroll={{ x: 'max-content', y: '100%' }}
        />
      </div>
      <Drawer
        title={!customerSelect ? 'Tạo mới người dùng' : 'Thêm nhân viên hỗ trợ'}
        width={360}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <CreateUser setCustomerForm={setNewCustomer} initForm={customerSelect} setSaleCustomer={setSale} />
      </Drawer>
    </div>
  );
};

export default ListCustomers;
