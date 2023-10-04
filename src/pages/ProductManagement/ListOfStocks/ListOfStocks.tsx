import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue } from 'antd/es/table/interface';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Avatar, Button, message, Space, Table, Typography } from 'antd';
import qs from 'qs';
import { useEffect, useState } from 'react';

import { apiUpdateLogoStock, getStockList } from '@/api/stock.api';
import MyModal from '@/components/basic/modal';
import MyUpLoad from '@/components/core/upload';

interface DataType {
  id: string;
  code: string;
  en_name: string;
  logo_url: string;
  market: string;
  name: string;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

const getRandomuserParams = (params: TableParams) => ({
  size: params.pagination?.pageSize,
  page: params.pagination?.current,
  market: params.filters?.market,
});

const Recommendations: React.FC = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [urlLogo, setUrlLogo] = useState<string>('');
  const [idStock, setIdStock] = useState<string>('');
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const { data, isLoading, isError } = useQuery({
    queryKey: ['getListStock', tableParams],
    queryFn: () => getStockList(qs.stringify(getRandomuserParams(tableParams))),
  });
  const updateLogo = useMutation({
    mutationFn: _ => apiUpdateLogoStock(idStock, urlLogo),
    onSuccess: _ => {
      queryClient.invalidateQueries(['getListStock']);
      setModalOpen(false);
      message.success('Update logo thành công');
    },
    onError: _ => {
      message.error('Update logo thất bại');
    },
  });

  const columns: ColumnsType<DataType> = [
    {
      title: 'Thị trường',
      dataIndex: 'market',
      // sorter: true,
      filters: [
        { text: 'Hose', value: 'HOSE' },
        { text: 'Hnx', value: 'HNX' },
        { text: 'Upcom', value: 'UPCOM' },
      ],
      width: '20%',
    },
    {
      title: 'Mã cổ phiếu',
      dataIndex: 'code',
      width: '20%',
    },
    {
      title: 'Tên công ty (tiếng Việt)',
      dataIndex: 'name',
    },
    {
      title: 'Tên công ty (tiếng Anh)',
      dataIndex: 'en_name',
    },
    {
      title: 'Logo',
      dataIndex: 'logo_url',
      key: 'logo_url',
      // render: () => <Avatar />,
      render: (_, record) => (
        <Space size="middle">
          {record.logo_url ? (
            <Avatar src={record.logo_url} size="large" />
          ) : (
            <Button
              type="primary"
              onClick={() => {
                setModalOpen(true), setIdStock(record.id);
              }}
            >
              +
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      // setData([]);
    }
  };

  const handleUpdateLogo = () => {
    updateLogo.mutate();
  };

  useEffect(() => {
    if (data) {
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: data?.count,
        },
      });
    }
  }, [data]);

  return (
    <div className="aaa">
      <div style={{ textAlign: 'center' }}>
        <Typography.Title level={2}>Danh mục cổ phiếu</Typography.Title>
      </div>
      <Table
        columns={columns}
        rowKey={record => record.id}
        dataSource={data?.rows}
        pagination={tableParams.pagination}
        loading={isLoading}
        onChange={handleTableChange}
        scroll={{ x: 'max-content', y: '100%' }}
      />
      <MyModal
        title="Cập nhật logo"
        centered
        open={modalOpen}
        onOk={handleUpdateLogo}
        onCancel={() => setModalOpen(false)}
        okButtonProps={{ disabled: !urlLogo && true }}
      >
        <MyUpLoad setUrlLogo={setUrlLogo} />
      </MyModal>
    </div>
  );
};

export default Recommendations;
