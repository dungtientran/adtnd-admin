import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue } from 'antd/es/table/interface';

import './index.less';

import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
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
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';

import { listSocialApi } from '@/api/ttd_socical';
import MyUpLoad from '@/components/core/upload';
import CreateSocial from '@/pages/components/form/form-create-social';
import HeadTitle from '@/pages/components/head-title/HeadTitle';
import Result from '@/pages/components/result/Result';

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
  // const [data, setData] = useState(originData);
  const [listSocial, setListSocial] = useState([]);
  const [editingKey, setEditingKey] = useState<string | number>('');
  const [interestSelect, setInterestSelect] = useState<any>(undefined);
  const [open, setOpen] = useState(false);
  const [newInteres, setNewInterst] = useState<any>();
  const [idDelete, setIdDelete] = useState<string| number | undefined>(undefined);

  const [selectedStatus, setSelectedStatus] = useState('all');

  const [logoUrl, setLogoUrl] = useState<any>('');
  const [fileList, setFileList] = useState<any[]>([]);

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: [10, 20, 50],
    },
  });

  const checkImageType = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file types!');
    }

    return isJpgOrPng;
  };

  const handleChange = (info: any) => {
    if (checkImageType(info.file)) {
      // setFileList(info.fileList);
      const formData = new FormData();

      formData.append('file', info.file);
      formData.append('upload_preset', 'qfxfgji7');

      setLogoUrl(formData);
    }
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
            <Form.Item name={dataIndex} style={{ margin: 0 }}>
              <MyUpLoad setUrlLogo={setLogoUrl} />
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

  const update = useMutation({
    mutationFn: _ => updateSocial(interestSelect?.id, interestSelect),
    onSuccess: _ => {
      queryClient.invalidateQueries(['getListSocial']);
      message.success('Update thành công');
      setEditingKey('');
      setInterestSelect(undefined);
    },
    onError: _ => {
      message.error('Update thất bại');
    },
  });

  const create = useMutation({
    mutationFn: _ => createSocial(newInteres),
    onSuccess: _ => {
      queryClient.invalidateQueries(['getListSocial']);
      message.success('Tạo thành công');
      setOpen(false);
    },
    onError: _ => {
      message.error('Tạo thất bại');
    },
  });
  const deleteSocialHandle = useMutation({
    mutationFn: _ => deleteSocial(idDelete as string),
    onSuccess: _ => {
      queryClient.invalidateQueries(['getListSocial']);
      message.success('Xóa thành công');
    },
    onError: _ => {
      message.error('Xóa thất bại');
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

    // if (interestSelect) {
    //   update.mutate();
    // }
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
      // editable: true,
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
          <Space>
            <Button type="primary" size="small" disabled={editingKey !== ''} onClick={() => edit(record)}>
              <EditOutlined />
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={() => setIdDelete(record?.id)}>
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
  
  useEffect(() => {
    if (idDelete) {
      deleteSocialHandle.mutate();
    }
  }, [idDelete]);

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
        <CreateSocial setNewInteres={setNewInterst} />
      </Drawer>
    </div>
  );
};

export default Support;
