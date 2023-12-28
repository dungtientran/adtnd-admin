/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ColumnListCustomerType, DataType, TableParams } from './index.interface';

import './index.less';

import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Drawer, message, notification, Table } from 'antd';
import qs from 'qs';
import { useEffect, useState } from 'react';

import { listCustomerApi } from '@/api/ttd_list_customer';
import BoxFilterListCustomer from '@/pages/components/box-filter/BoxFilterListCustomer';
import ExportExcel from '@/pages/components/button-export-excel/ExportExcel';
import CreateUser from '@/pages/components/form/form-add-user';
import ChangeSubscription from '@/pages/components/form/form-change-subscription';
import HeadTitle from '@/pages/components/head-title/HeadTitle';
import Result from '@/pages/components/result/Result';

import { Column } from './columns';

const { getListCustomer, createCustomer, addSaleCustomer, removeSaleCustomer, changeSubscription } = listCustomerApi;

const ListCustomers: React.FC = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [openChange, setOpenChange] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '50'],
    },
  });
  const [sort, setSort] = useState<string>('');
  const [searchText, setSearchText] = useState({});
  const [queryFilter, setQuerFilter] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [listCustomer, setListCustomer] = useState([]);
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

  const useCustomer = () => {
    const create = useMutation(createCustomer, {
      onSuccess: () => {
        queryClient.invalidateQueries(['getListCustomer']);
        message.success('Tạo người dùng mới thành công');
        setOpen(false);
      },
      onError: (err: any) => {
        message.error(err?.message || 'Tạo mới thất bại');
      },
    });
    const update = useMutation(addSaleCustomer, {
      onSuccess: () => {
        queryClient.invalidateQueries(['getListCustomer']);
        message.success('Thêm nhân viên hỗ trợ thành công');
        setOpen(false);
      },
      onError: (err: any) => {
        message.error(err?.message || 'Thêm nhân viên hỗ trợ thất bại');
      },
    });
    const deleteSale = useMutation(removeSaleCustomer, {
      onSuccess: () => {
        queryClient.invalidateQueries(['getListCustomer']);
        message.success('Xóa nhân viên hỗ trợ thành công');
        setOpen(false);
      },
      onError: (err: any) => {
        message.error(err?.message || 'Xóa nhân viên hỗ trợ thất bại');
      },
    });

    const subscriptionChage = useMutation(changeSubscription, {
      onSuccess: () => {
        queryClient.invalidateQueries(['getListCustomer']);
        message.success('Thay đổi gói dịch vụ thành công');
        setOpenChange(false);
      },
      onError: (err: any) => {
        message.error(err?.message || 'Thay đổi gói dịch vụ thất bại');
      },
    });

    return { create, update, deleteSale, subscriptionChage };
  };

  const showDrawer = () => {
    setCustomerSelect(undefined);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onCloseChange = () => {
    setOpenChange(false);
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

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
    setTableParams({
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
      },
    });
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

  // console.log('excelData_____________', dataExcel);

  useEffect(() => {
    if (isLoading) setDataExcel([]);
  }, [isLoading]);

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
        clearFilter={handleClearFilter}
        setTableParams={setTableParams}
      />
      <Result
        total={data?.data?.count}
        searchText={searchedColumn}
        columns={Column(setSearchText, setOpen, setCustomerSelect, useCustomer, setOpenChange)}
        dataSource={dataExcel}
        title="Danh sách khách hàng"
      />
      <div className="table_list_customer">
        <Table
          columns={Column(setSearchText, setOpen, setCustomerSelect, useCustomer, setOpenChange)}
          rowKey={record => record.id}
          dataSource={listCustomer}
          pagination={tableParams.pagination}
          loading={isLoading}
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
        <CreateUser initForm={customerSelect} setSaleCustomer={setSale} useCustomer={useCustomer} />
      </Drawer>
      <Drawer
        title="Thay đổi gói dịch vụ"
        width={360}
        onClose={onCloseChange}
        open={openChange}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <ChangeSubscription initForm={customerSelect} setSaleCustomer={setSale} useCustomer={useCustomer} />
      </Drawer>
    </div>
  );
};

export default ListCustomers;
