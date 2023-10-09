import { Button, Form, Input, InputNumber, Popconfirm, Radio, Select, Space, Table, Tag, Typography } from 'antd';
import React, { Fragment, useState } from 'react';

interface Item {
  key: React.Key;
  id: string;
  service_pack: string;
  description: string;
  status: string;
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
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const ServicePack: React.FC = () => {
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [count, setCount] = useState(4);
  const [editingKey, setEditingKey] = useState<any>('');
  const [add1CaiThoi, setAdd1CaiThoi] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [dataSource, setDataSource] = useState<Item[]>([
    {
      id: '1',
      service_pack: 'Trial',
      description: 'Gói dùng thử',
      status: 'Đang hoạt động',
      key: '1',
    },
    {
      id: '2',
      service_pack: 'Vip',
      description: 'Gói Vip',
      status: 'Đang hoạt động',
      key: '2',
    },
    {
      id: '3',
      service_pack: 'Premium',
      description: 'Gói Premium',
      status: 'Đang hoạt động',
      key: '3',
    },
  ]);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  const handleAdd = () => {
    const newData: Item = {
      key: count,
      id: '',
      service_pack: `Gói ${count}`,
      description: `Gói ${count}`,
      status: `Đang hoạt động`,
    };

    setAdd1CaiThoi(true);
    setIsEdit(true);
    setEditingKey(newData.key);
    isEditing(newData);
    setIsAdd(true);
    setDataSource([newData, ...dataSource]);
    setCount(count + 1);
  };

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: any) => {
    form.setFieldsValue({ service_pack: '', description: '', status: '', ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
    setAdd1CaiThoi(false);
    setIsEdit(false);

    if (isAdd) {
      const newData = dataSource.slice(1);

      setDataSource(newData);
    }

    setIsAdd(false);
  };

  const save = async (key: any) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...dataSource];
      const index = newData.findIndex(item => key === item.key);

      if (index > -1) {
        const item = newData[index];

        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setDataSource(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setDataSource(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Gói dịch vụ',
      dataIndex: 'service_pack',
      width: '30%',
      editable: isEdit,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      editable: true,
    },
    {
      title: 'Tình trạng',
      dataIndex: 'status',
      editable: false,
      render: (_: any, record: Item) => <Tag color="green">{record.status}</Tag>,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_: any, record: Item) => {
        const editable = isEditing(record);

        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Space>
            {/* <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </Typography.Link> */}
            <Typography.Link type="danger" disabled={editingKey !== ''}>
              Block
            </Typography.Link>
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
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div className="aaa">
      <div style={{ textAlign: 'center' }}>
        <Typography.Title level={2}>Gói dịch vụ</Typography.Title>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px' }}>
        <Space>
          <Typography.Text>Trạng thái: </Typography.Text>
          <Radio.Group
            defaultValue={''}
            // onChange={e => setStatusFilter(e.target.value)}
            // onChange={e => console.log('radio____________', e.target.value)}
            onChange={handleToggle}
          >
            <Radio.Button value="">Tất cả</Radio.Button>
            <Radio.Button value="open">Đang hoạt động</Radio.Button>
            <Radio.Button value="closed">Ngừng hoạt động</Radio.Button>
          </Radio.Group>
        </Space>
        {/* <Button disabled={add1CaiThoi} onClick={handleAdd} type="primary">
          Thêm dịch vụ
        </Button> */}
      </div>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={dataSource}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </div>
  );
};

export default ServicePack;
