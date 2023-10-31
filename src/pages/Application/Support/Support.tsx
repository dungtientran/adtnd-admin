/* eslint-disable @typescript-eslint/no-unused-vars */
import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue } from 'antd/es/table/interface';

import './index.less';

import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Avatar,
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Radio,
  Space,
  Spin,
  Switch,
  Table,
  Tag,
  Typography,
  Upload,
} from 'antd';
import React, { useEffect, useState } from 'react';

import { listSocialApi } from '@/api/ttd_socical';
import MyButton from '@/components/basic/button';
import CreateSocial from '@/pages/components/form/form-create-social';
import HeadTitle from '@/pages/components/head-title/HeadTitle';
import Result from '@/pages/components/result/Result';
import { checkImageType } from '@/utils/checkImageType';
import { getUrlImageUpload } from '@/utils/getUrlImageUpload';

const { createSocial, deleteSocial, getList, updateSocial } = listSocialApi;
const { Text } = Typography;

interface Item {
  icon_url: string;
  id: number;
  is_actived: boolean;
  link_url: string;
  order: number;
  title: string;
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

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

const Support = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [listSocial, setListSocial] = useState([]);
  const [editingKey, setEditingKey] = useState<string | number>('');
  const [open, setOpen] = useState(false);
  const [spining, setSpining] = useState<boolean>(false);

  const [selectedStatus, setSelectedStatus] = useState('all');

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: [10, 20, 50],
    },
  });

  const handleChange = (info: any) => {
    checkImageType(info.file);
  };

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
          dataIndex === 'icon_url' ? (
            <Form.Item name="logoUpload" style={{ margin: 0 }}>
              <Upload
                action=""
                listType="picture"
                maxCount={1}
                accept="image/png, image/gif, image/jpeg"
                onChange={handleChange}
                beforeUpload={_ => {
                  return false;
                }}
                // fileList={[...fileList]}
              >
                <MyButton icon={<UploadOutlined />}>Upload (Max: 1)</MyButton>
              </Upload>
            </Form.Item>
          ) : dataIndex === 'is_actived' ? (
            <Form.Item name={dataIndex} style={{ margin: 0 }} valuePropName="checked">
              <Switch unCheckedChildren="Vô hiệu hóa" checkedChildren="Hiệu lực" />
            </Form.Item>
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
              <Input />
            </Form.Item>
          )
        ) : (
          children
        )}
      </td>
    );
  };

  const isEditing = (record: Item) => record.id === editingKey;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getListSocial'],
    queryFn: () => getList(),
  });

  const useSupport = () => {
    const create = useMutation(createSocial, {
      onSuccess: () => {
        queryClient.invalidateQueries(['getListSocial']);
        message.success('Tạo thành công');
        setOpen(false);
      },
      onError: _ => {
        message.error('Tạo thất bại');
      },
    });
    const update = useMutation(updateSocial, {
      onSuccess: () => {
        queryClient.invalidateQueries(['getListSocial']);
        message.success('Update thành công');
        setEditingKey('');
      },
      onError: _ => {
        message.error('Update thất bại');
      },
    });
    const deleteSupport = useMutation(deleteSocial, {
      onSuccess: () => {
        queryClient.invalidateQueries(['getListSocial']);
        message.success('Xóa thành công');
      },
      onError: _ => {
        message.error('Xóa thất bại');
      },
    });

    return { create, update, deleteSupport };
  };

  const { create, update, deleteSupport } = useSupport();

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
    setSpining(true);
    const row = await form.validateFields();
    let editSubscription;

    if (row.logoUpload) {
      const file = row.logoUpload.file;
      const icon_url = await getUrlImageUpload('icon-support', file);

      editSubscription = {
        ...row,
        id: record.id,
        icon_url,
      };
      update.mutate({ id: record.id.toString(), payload: editSubscription });
    } else {
      editSubscription = {
        ...row,
        id: record.id,
      };
      update.mutate({ id: record.id.toString(), payload: editSubscription });
    }

    setSpining(false);
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      // setListSocial([]);
    }

    // if (sorter.order === 'ascend') {
    //   const sorte = `${sorter.field}_order=ASC`;

    //   setSort(sorte);
    // } else if (sorter.order === 'descend') {
    //   const sorte = `${sorter.field}_order=DESC`;

    //   setSort(sorte);
    // }
  };

  const columns = [
    {
      title: 'Thứ tự hiển thị',
      dataIndex: 'order',
      width: '10%',
      editable: true,
    },
    {
      title: 'Icon',
      dataIndex: 'icon_url',
      width: '10%',
      editable: true,
      render: (_: any, record: any) => <Avatar size="large" src={record?.icon_url} alt={record?.title} />,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      // width: '40%',
      editable: true,
    },
    {
      title: 'URL',
      dataIndex: 'link_url',
      // width: '40%',
      editable: true,
    },
    {
      title: 'Tình trạng',
      dataIndex: 'is_actived',
      width: '10%',
      editable: true,
      render: (_: any, record: any) => (
        <Tag color={record?.is_actived ? 'blue' : 'red'}> {record?.is_actived ? 'Hiệu lực' : 'Vô hiệu hóa'}</Tag>
      ),
    },
    {
      title: '',
      dataIndex: 'action',
      width: '10%',
      render: (_: any, record: Item) => {
        const editable = isEditing(record);

        return editable ? (
          <Space>
            <Spin spinning={spining}>
              <Button size="small" type="dashed" onClick={() => save(record)} style={{ marginRight: 8 }}>
                <CheckOutlined />
              </Button>
            </Spin>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button size="small" type="dashed">
                <CloseOutlined />
              </Button>
            </Popconfirm>
          </Space>
        ) : (
          <Space>
            <Button type="primary" size="small" disabled={editingKey !== ''} onClick={() => edit(record)}>
              <EditOutlined />
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={() => deleteSupport.mutate(record.id.toString())}>
              <Button type="primary" size="small" disabled={editingKey !== ''}>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Space>
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

  useEffect(() => {
    if (!data) return;

    if (data) {
      setListSocial(data?.data);
      const filterSocials = data?.data?.filter((item: Item) => {
        if (selectedStatus === 'all') {
          return true;
        } else if (selectedStatus === 'active') {
          return item.is_actived === true;
        } else {
          return item.is_actived === false;
        }
      });

      setListSocial(filterSocials);
    }
  }, [data, selectedStatus]);

  // console.log('page______________', page);

  return (
    <div>
      <Form form={form} component={false}>
        <HeadTitle title="Thiết lập liên kết hỗ trợ" />
        <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'center' }}>
          <Button onClick={() => setOpen(true)} type="primary">
            <PlusOutlined /> Tạo mới
          </Button>
        </div>
        <Space
          direction="vertical"
          size="middle"
          style={{
            marginBottom: '20px',
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '6px',
            marginTop: '10px',
          }}
        >
          <Space>
            <Text strong>Tình trạng: </Text>
            <Radio.Group onChange={e => setSelectedStatus(e.target.value)} value={selectedStatus}>
              <Radio.Button value="all">Tất cả</Radio.Button>
              <Radio.Button value="active">Hiệu lực</Radio.Button>
              <Radio.Button value="inactive">Vô hiệu hóa</Radio.Button>
            </Radio.Group>
          </Space>
          {/* <Button
          // onClick={handleResetFilter}
          >
            Reset bộ lọc
            </Button> */}
        </Space>
        <Result total={listSocial?.length} isButtonExcel={false} />
        <div className="table_support">
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={listSocial}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={tableParams.pagination}
            onChange={handleTableChange}
            style={{
              height: 'auto',
            }}
          />
        </div>
      </Form>
      <Drawer title="Tạo mới" width={360} onClose={onClose} open={open} bodyStyle={{ paddingBottom: 80 }}>
        <CreateSocial create={create} />
      </Drawer>
    </div>
  );
};

export default Support;
