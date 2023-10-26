/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ColumnTyle, DataType, TableParams } from './index.interface';

import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, DatePicker, Drawer, message, Spin, Table } from 'antd';
import qs from 'qs';
import { useEffect, useState } from 'react';

const { RangePicker } = DatePicker;

import { listContractApi } from '@/api/ttd_contract';
import { listCustomerApi } from '@/api/ttd_list_customer';
import MyModal from '@/components/basic/modal';
import CreateContract from '@/pages/components/form/form-contract';
import HeadTitle from '@/pages/components/head-title/HeadTitle';
import Result from '@/pages/components/result/Result';

import BoxFilter from './boxFilter';
import { Column } from './columns';
import DetailsContract from './DetailsContract';

const { getListContract, createContract, updateContract } = listContractApi;

const BlockContract: React.FC = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModel] = useState(false);
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
  const [listCustomerSp, setListCustomerSp] = useState([]);
  const [newContract, setNewContract] = useState<any>();

  const [dataExcel, setDataExcel] = useState([]);

  const [queryFilter, setQueryFilter] = useState<string>('');
  const [updateDataSp, setUpdateDataSp] = useState<any>();
  const [customerSelect, setCustomerSelect] = useState<any>();
  const [idDelete, setIdDelete] = useState<string>('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getListContract', tableParams, queryFilter, searchText, sort],
    queryFn: () =>
      getListContract(qs.stringify(getRandomuserParams(tableParams)), queryFilter, qs.stringify(searchText), sort),
  });

  const update = useMutation({
    mutationFn: _ => updateContract(updateDataSp?.contract_no as string, updateDataSp),
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
    status: 'done',
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

    if (sorter.order === 'ascend') {
      const sorte = `${sorter.field}_order=ASC`;

      setSort(sorte);
    } else if (sorter.order === 'descend') {
      const sorte = `${sorter.field}_order=DESC`;

      setSort(sorte);
    }
  };

  const handelResetFilter = () => {
    setQueryFilter('');
    setSearchText('');
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

      const columndata = data?.data?.rows.map((item: DataType) => {
        return {
          id: item?.id,
          contract_no: item?.contract_no,
          customer_code: item?.customer?.customer_code,
          name: item?.customer?.fullname,
          phone_number: item?.customer?.phone_number,
          email: item?.customer?.email,
          staff_code: item?.sale?.staff_code,
          name_sale: item?.sale?.fullname,
          start_date: item?.start_date,
          end_date: item?.end_date,
          initial_value: item?.initial_value,
          expected_end_value: item?.expected_end_value,
          commission: item?.contract_commission?.fila_commission,
          status: 'Đã thanh lý',
          profit_percent: item?.profit_percent,
          total_commission:
            item?.contract_commission?.director_commission +
            item?.contract_commission?.fila_commission +
            item?.contract_commission?.manager_commission +
            item?.contract_commission?.sales_commission,
        };
      });

      getListDataExcel(data?.data?.count);

      // console.log('newArrData_____________________', newArrData);
      // console.log(getDataExcep.data);

      setListCustomerSp(columndata);
    }
  }, [data]);

  const getListDataExcel = async (limit: number) => {
    try {
      const res = await getListContract(
        `status=done&page=1&size=${limit}`,
        queryFilter,
        qs.stringify(searchText),
        sort,
      );

      if (res?.code === 200) {
        const dataExcel = res?.data?.rows;
        const columnsExcel = dataExcel?.map((item: DataType) => {
          return {
            id: item?.id,
            contract_no: item?.contract_no,
            customer_code: item?.customer?.customer_code,
            name: item?.customer?.fullname,
            phone_number: item?.customer?.phone_number,
            email: item?.customer?.email,
            staff_code: item?.sale?.staff_code,
            name_sale: item?.sale?.fullname,
            start_date: item?.start_date,
            end_date: item?.end_date,
            initial_value: item?.initial_value,
            expected_end_value: item?.expected_end_value,
            commission: item?.contract_commission?.fila_commission,
            status: item?.status === 'pending' ? 'Đang có hiệu lực' : 'Đã thanh lý',
            profit_percent: item?.profit_percent,
            total_commission:
              item?.contract_commission?.director_commission +
              item?.contract_commission?.fila_commission +
              item?.contract_commission?.manager_commission +
              item?.contract_commission?.sales_commission,
          };
        });

        setDataExcel(columnsExcel);
      } else {
        message.error('Có lỗi từ server');
      }
    } catch (error) {
      message.error('Có lỗi từ server');
    }

    return data;
  };

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

  // console.log('customerSelect_______________________', customerSelect);
  // console.log("sort______________________", sort);
  // console.log("dataEcel____________________", dataExcel);
  return (
    <div className="aaa">
      <HeadTitle title="Hợp đồng đã thanh lý" />

      <BoxFilter setQueryFilter={setQueryFilter} handelResetFilter={handelResetFilter} />
      <Result
        total={data?.data?.count}
        columns={Column(setSearchText, setOpen, setCustomerSelect, setIdDelete, setOpenModel)}
        dataSource={dataExcel}
        title="Danh sách hợp đồng Vip (hết hiệu lực)"
        totalCommission={data?.total}
      />
      <div className="table_contract">
        <Table
          columns={Column(setSearchText, setOpen, setCustomerSelect, setIdDelete, setOpenModel)}
          rowKey={record => record.id}
          dataSource={listCustomerSp}
          pagination={tableParams.pagination}
          loading={isLoading}
          onChange={handleTableChange}
          scroll={{ x: 'max-content', y: '100%' }}
          style={{ height: 'auto' }}
        />
      </div>
      <Drawer
        title={!customerSelect ? 'Thêm hợp đồng' : 'Sửa hợp đồng'}
        width={360}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
      >
        {/* <Spin spinning={update.isLoading}> */}
        {/* <CreateContract
          setUpdateDataSp={setUpdateDataSp}
          initForm={customerSelect}
          loading={!customerSelect ? isLoading : update.isLoading}
          saleData={ad}
          useData={}
        /> */}
        {/* </Spin> */}
      </Drawer>
      <MyModal
        // title="Chi tiết hợp đồng"
        centered
        open={openModal}
        onCancel={() => setOpenModel(false)}
        className="modal_contract"
        width={1000}
      >
        <DetailsContract details={customerSelect} />
      </MyModal>
    </div>
  );
};

export default BlockContract;
