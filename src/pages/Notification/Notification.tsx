import type { TableParams } from './index.interface';

import './index.less';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Drawer, message, Modal, Table } from 'antd';
import qs from 'qs';
import { useEffect, useState } from 'react';

import { listNotificationApi } from '@/api/ttd_notification';
import HeadTitle from '@/pages/components/head-title/HeadTitle';
import Result from '@/pages/components/result/Result';

import NotificationForm from '../components/form/form-createa-notification';
import SendNotification from '../components/form/form-send-notification';
import { Column } from './columns';
import BoxFilter from './boxFilter';

const { createNotification, delteleNotification, getListNotification, updateNotification, sendNotification } =
  listNotificationApi;

const Notification: React.FC = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const [idNotification, setIdNotification] = useState<string>('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getListNotification', queryFilter, searchText, tableParams],
    queryFn: () =>
      getListNotification(qs.stringify(getRandomuserParams(tableParams)), queryFilter, qs.stringify(searchText)),
  });

  const getRandomuserParams = (params: TableParams) => ({
    size: params.pagination?.pageSize,
    page: params.pagination?.current,
    role: params.filters?.role?.join(','),
  });

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onClose = () => {
    setOpen(false);
  };

  const useNotification = () => {
    const create = useMutation(createNotification, {
      onSuccess: () => {
        queryClient.invalidateQueries(['getListNotification']);
        message.success('Tạo thành công');
        setOpen(false);
        setCustomerSelect(undefined);
      },
      onError: (err: any) => {
        message.error(`${err?.message}` || 'Tạo thất bại');
      },
    });
    const update = useMutation(updateNotification, {
      onSuccess: () => {
        queryClient.invalidateQueries(['getListNotification']);
        message.success('Update thành công');
        setOpen(false);
        setCustomerSelect(undefined);
      },
      onError: (err: any) => {
        message.error(`${err?.message}` || 'Update thất bại');
      },
    });
    const deleteNotification = useMutation(delteleNotification, {
      onSuccess: () => {
        queryClient.invalidateQueries(['getListNotification']);
        message.success('Xóa thành công');
        // setOpen(false);
      },
      onError: (err: any) => {
        message.error(`${err?.message}` || 'Xóa thất bại');
      },
    });
    const sendNotificationHandle = useMutation(sendNotification, {
      onSuccess: () => {
        queryClient.invalidateQueries(['getListNotification']);
        message.success('Gửi thành công');
        setIsModalOpen(false);
      },
      onError: (err: any) => {
        message.error(`${err?.message}` || 'Gửi thất bại');
      },
    });

    return { create, update, deleteNotification, sendNotificationHandle };
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
      <HeadTitle title="Thiết lập thông báo" />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button
          type="primary"
          onClick={() => {
            setOpen(true), setCustomerSelect(undefined);
          }}
        >
          Tạo mới
        </Button>
      </div>
      <BoxFilter  setQueryFilter={setQueryFilter}/>
      <Result total={data?.data?.count} searchText={searchedColumn} isButtonExcel={false} />
      <div className="table_user">
        <Table
          columns={Column(
            setSearchText,
            setOpen,
            setCustomerSelect,
            useNotification,
            setIsModalOpen,
            setIdNotification,
          )}
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
        title={!customerSelect ? 'Tạo mới thông báo' : 'Chỉnh sửa thông báo '}
        width={360}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <NotificationForm initForm={customerSelect} useSale={useNotification} />
      </Drawer>
      <div className="modal_send_notification">
        <Modal title="Gửi thông báo" centered open={isModalOpen} onCancel={handleCancel} footer={null}>
          <SendNotification idNotification={idNotification} useSale={useNotification} />
        </Modal>
      </div>
    </div>
  );
};

export default Notification;
