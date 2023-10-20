import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue } from 'antd/es/table/interface';

import { CheckOutlined, CloseOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Drawer, Form, Input, InputNumber, message, Popconfirm, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { Fragment, useEffect, useState } from 'react';

import { listInterestRateApi } from '@/api/ttd_interest_rate';
import CreateInterest from '@/pages/components/form/form-create-interest';
import HeadTitle from '@/pages/components/head-title/HeadTitle';
import Result from '@/pages/components/result/Result';

const { getListProfit, getListSubscription, updateInterest, createInterstRate } = listInterestRateApi;
const { Text } = Typography;

interface Item {
  id: string;
  created_at: string;
  director_commission_rate: number;
  fila_commission_rate: number;
  manager_commision_rate: number;
  profit_from: string | null;
  profit_to: string | null;
  sale_commission_rate: number;
  type: string;
  updated_at: string;
  subscription_product: {
    description: string;
    id: string;
    name: string;
    topic: string;
  };
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        dataIndex === 'profit' ? (
          <Space>
            <Form.Item
              name={'profit_from'}
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: `Vui lòng nhập ${title}!`,
                },
              ]}
              label="Từ"
            >
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item
              label="Đến"
              name={'profit_to'}
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: `Vui lòng nhập ${title}!`,
                },
              ]}
            >
              <InputNumber min={0} />
            </Form.Item>
          </Space>
        ) : (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Vui lòng nhập ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        )
      ) : (
        children
      )}
    </td>
  );
};

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

const SetInterestRate = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  // const [data, setData] = useState(originData);
  const [listSubscription, setListSubscription] = useState([]);
  const [listProfit, setListProfit] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [interestSelect, setInterestSelect] = useState<any>();
  const [open, setOpen] = useState(false);
  const [newInteres, setNewInterst] = useState<any>();
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  const isEditing = (record: Item) => record.id === editingKey;

  const getdataSubscription = useQuery({
    queryKey: ['getListSubscription'],
    // queryFn: () => getListSubscription(qs.stringify(getRandomuserParams(tableParams)), sort, searchText),
    queryFn: () => getListSubscription(),
  });
  const getdataProfit = useQuery({
    queryKey: ['getListProfit', page],
    // queryFn: () => getListSubscription(qs.stringify(getRandomuserParams(tableParams)), sort, searchText),
    queryFn: () => getListProfit(page),
  });
  const update = useMutation({
    mutationFn: _ => updateInterest(interestSelect?.id, interestSelect),
    onSuccess: _ => {
      queryClient.invalidateQueries(['getListSubscription']);
      queryClient.invalidateQueries(['getListProfit']);
      message.success('Update thành công');
      setEditingKey('');
    },
    onError: _ => {
      message.error('Update thất bại');
    },
  });
  const create = useMutation({
    mutationFn: _ => createInterstRate(newInteres),
    onSuccess: _ => {
      queryClient.invalidateQueries(['getListProfit']);
      message.success('Tạo thành công');
      setOpen(false);
    },
    onError: _ => {
      message.error('Tạo thất bại');
    },
  });

  const edit = (record: any) => {
    // console.log('record_____________', record);
    form.setFieldsValue({ ...record });
    setEditingKey(record.id as string);
  };

  const onClose = () => {
    setOpen(false);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (record: Item) => {
    const row = await form.validateFields();

    // console.log('record_________________save', record);
    const editSubscription = {
      ...row,
      id: record.id,
    };

    setInterestSelect(editSubscription);

    // console.log('editSubscription___________', editSubscription);

    if (interestSelect) {
      update.mutate();
    }
  };

  const columns = [
    {
      title: 'Gói dịch vụ',
      dataIndex: 'subscription_product',
      width: '25%',
      render: (record: any) => <Text>{record.name}</Text>,
    },
    {
      title: 'Lợi nhuận Fila hưởng (%)',
      dataIndex: 'fila_commission_rate',
      width: '15%',
      editable: true,
    },
    {
      title: 'Giám đốc (%)',
      dataIndex: 'director_commission_rate',
      // width: '40%',
      editable: true,
    },
    {
      title: 'Trưởng phòng (%)',
      dataIndex: 'manager_commision_rate',
      // width: '40%',
      editable: true,
    },
    {
      title: 'Sale (%)',
      dataIndex: 'sale_commission_rate',
      // width: '40%',
      editable: true,
    },
    {
      title: '',
      dataIndex: 'action',
      width: '10%',
      render: (_: any, record: Item) => {
        const editable = isEditing(record);

        return editable ? (
          <Space>
            <Button size="small" type="dashed" onClick={() => save(record)} style={{ marginRight: 8 }}>
              <CheckOutlined />
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button size="small" type="dashed">
                <CloseOutlined />
              </Button>
            </Popconfirm>
          </Space>
        ) : (
          <Button type="primary" size="small" disabled={editingKey !== ''} onClick={() => edit(record)}>
            <EditOutlined />
          </Button>
        );
      },
    },
  ];
  const columnsProfit = [
    {
      title: 'Lợi nhuận (%)',
      dataIndex: 'profit',
      // width: '25%',
      editable: true,
      render: (_: any, record: any) => (
        <Text>
          Từ <Text strong>{record?.profit_from}</Text> đến <Text strong>{record?.profit_to}</Text>
        </Text>
      ),
    },
    {
      title: 'Lợi nhuận Fila hưởng (%)',
      dataIndex: 'fila_commission_rate',
      width: '15%',
      editable: true,
    },
    {
      title: 'Giám đốc (%)',
      dataIndex: 'director_commission_rate',
      // width: '40%',
      editable: true,
    },
    {
      title: 'Trưởng phòng (%)',
      dataIndex: 'manager_commision_rate',
      // width: '40%',
      editable: true,
    },
    {
      title: 'Sale (%)',
      dataIndex: 'sale_commission_rate',
      // width: '40%',
      editable: true,
    },
    {
      title: '',
      dataIndex: 'action',
      width: '10%',
      render: (_: any, record: Item) => {
        const editable = isEditing(record);

        return editable ? (
          <Space>
            <Button size="small" type="dashed" onClick={() => save(record)} style={{ marginRight: 8 }}>
              <CheckOutlined />
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button size="small" type="dashed">
                <CloseOutlined />
              </Button>
            </Popconfirm>
          </Space>
        ) : (
          <Button type="primary" size="small" disabled={editingKey !== ''} onClick={() => edit(record)}>
            <EditOutlined />
          </Button>
        );
      },
    },
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === 'profit' ? 'text' : 'number',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const mergedColumnsProfit = columnsProfit.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === 'profit' ? 'text' : 'number',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  // const handleTableChange = (pagination: any, filters: any, sorter: any) => {
  //   setTableParams({
  //     pagination,
  //     filters,
  //     ...sorter,
  //   });

  //   if (pagination.pageSize !== tableParams.pagination?.pageSize) {
  //     // setData([]);
  //   }

  //   // if (sorter.order === 'ascend') {
  //   //   const sorte = `${sorter.field}_order=ASC`;

  //   //   setSort(sorte);
  //   // } else if (sorter.order === 'descend') {
  //   //   const sorte = `${sorter.field}_order=DESC`;

  //   //   setSort(sorte);
  //   // }
  // };

  useEffect(() => {
    if (getdataSubscription.data) {
      setListSubscription(getdataSubscription.data?.data?.rows);
    }

    if (getdataProfit.data) {
      // setTableParams({
      //   pagination: {
      //     ...tableParams.pagination,
      //     total: getdataProfit.data?.data?.count,
      //   },
      // });
      setTotal(getdataProfit.data?.data?.count);
      setListProfit(getdataProfit.data?.data?.rows);
    }
  }, [getdataSubscription, getdataProfit]);

  useEffect(() => {
    if (interestSelect) {
      update.mutate();
    }
  }, [interestSelect]);

  useEffect(() => {
    if (newInteres) {
      create.mutate();
    }
  }, [newInteres]);

  // console.log('page______________', page);

  return (
    <div>
      <Form form={form} component={false}>
        <HeadTitle title="Biểu hoa hồng kinh doanh theo gói dịch vụ" />

        <Result total={getdataSubscription.data?.data?.count} isButtonExcel={false} />
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={listSubscription}
          columns={mergedColumns}
          rowClassName="editable-row"
          // pagination={{
          //   onChange: cancel,
          // }}
          pagination={false}
          style={{
            height: 'auto',
          }}
        />
      </Form>
      <Form form={form} component={false}>
        <HeadTitle title="Biểu hoa hồng kinh doanh cho gói VIP" />
        <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'center' }}>
          <Button onClick={() => setOpen(true)} type="primary">
            <PlusOutlined /> Tạo mới
          </Button>
        </div>
        <Result total={getdataProfit.data?.data?.count} isButtonExcel={false} />
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={listProfit}
          columns={mergedColumnsProfit}
          rowClassName="editable-row"
          pagination={{
            total: total,
            // current: 1,
            // pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50],
          }}
          //  onChange={handleTableChange}
          style={{ height: 'auto' }}
          onChange={pagination => setPage(pagination.current as number)}
        />
      </Form>
      <Drawer title="Tạo mới" width={360} onClose={onClose} open={open} bodyStyle={{ paddingBottom: 80 }}>
        <CreateInterest setNewInteres={setNewInterst} />
      </Drawer>
    </div>
  );
};

export default SetInterestRate;
