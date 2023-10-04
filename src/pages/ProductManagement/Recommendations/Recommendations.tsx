import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';

import { BorderOuterOutlined, UploadOutlined } from '@ant-design/icons';
import { Avatar, Button, Popconfirm, Space, Table, Typography, Upload } from 'antd';
import axios from 'axios';
import qs from 'qs';
import React, { useEffect, useState } from 'react';

import MyButton from '@/components/basic/button';
import MyModal from '@/components/basic/modal';

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
  results: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});

const Recommendations: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const columns: ColumnsType<DataType> = [
    {
      title: 'Thị trường',
      dataIndex: 'market',
      // sorter: true,
      filters: [
        { text: 'Hose', value: 'hose' },
        { text: 'Hnx', value: 'hnx' },
        { text: 'Upcom', value: 'upcom' },
      ],
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
            <Button type="primary" onClick={() => setModalOpen(true)}>
              +
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const fetchData = () => {
    setLoading(true);
    // fetch(`https://randomuser.me/api?${qs.stringify(getRandomuserParams(tableParams))}`)
    fetch(`https://yys2edw6d6.execute-api.ap-southeast-1.amazonaws.com/dev/stock/get-list-stock`)
      .then(res => res.json())
      .then(({ results }) => {
        console.log(results);
        setData(results);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: 200,
          },
        });
      });
  };

  const fetchStock = async () => {
    setLoading(true);
    // fetch(`https://randomuser.me/api?${qs.stringify(getRandomuserParams(tableParams))}`)
    const res = await axios.get(
      `https://yys2edw6d6.execute-api.ap-southeast-1.amazonaws.com/dev/stock/get-list-stock?size=${tableParams.pagination?.pageSize}&page=${tableParams.pagination?.current}`,
    );

    console.log(res.data);

    if (res.data?.code === 200) {
      setData(res.data?.data?.rows);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: res.data?.data?.count,
        },
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchStock();
  }, [JSON.stringify(tableParams)]);

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  console.log('tableParams___________', tableParams);
  // console.log('data_________________', data);

  return (
    <div className="aaa">
      <div style={{ textAlign: 'center' }}>
        <Typography.Title level={2}>Khuyến nghị</Typography.Title>
      </div>
      <Table
        columns={columns}
        rowKey={record => record.id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: 'max-content', y: '100%' }}
      />
      <MyModal
        title="Cập nhật logo"
        centered
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
      >
        <div>
          <Typography.Title level={5}>Hình ảnh</Typography.Title>
          <Upload
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            listType="picture"
            maxCount={1}
            // beforeUpload={beforeUpload}
          >
            <MyButton icon={<UploadOutlined />}>Upload (Max: 1)</MyButton>
          </Upload>
        </div>
      </MyModal>
    </div>
  );
};

export default Recommendations;
