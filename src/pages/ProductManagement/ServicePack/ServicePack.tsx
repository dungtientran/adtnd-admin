import type { InputRef } from 'antd';
import type { FormInstance } from 'antd/es/form';

import { Button, Form, Input, Popconfirm, Space, Table, Typography } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key?: React.Key;
  id: string;
  service_pack: string;
  description: string;
  status: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const ServicePack = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([
    {
      id: '1',
      service_pack: 'Trial',
      description: 'Gói dùng thử',
      status: 'Đang hoạt động',
    },
    {
      id: '2',
      service_pack: 'Vip',
      description: 'Gói Vip',
      status: 'Đang hoạt động',
    },
    {
      id: '3',
      service_pack: 'Premium',
      description: 'Gói Premium',
      status: 'Đang hoạt động',
    },
  ]);

  const [count, setCount] = useState(2);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter(item => item.key !== key);

    setDataSource(newData);
  };

  const defaultColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Gói dịch vụ',
      dataIndex: 'service_pack',
      width: '30%',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      editable: true,
    },
    {
      title: 'Tình trạng',
      dataIndex: 'status',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (record: { key: React.Key }) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <Button danger size="small">
              Vô hiệu hóa
            </Button>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      key: count,
      id: count + '',
      service_pack: `Gói ${count}`,
      description: `Gói ${count}`,
      status: `Đang hoạt động`,
    };

    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];

    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div className='aaa'>
      <div style={{ textAlign: 'center' }}>
        <Typography.Title level={2}>Gói dịch vụ</Typography.Title>
      </div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px'}}>
        <Space>
          Tình trạng:
        </Space>
        <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Add a row
        </Button>
      </div>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
      />
    </div>
  );
};

export default ServicePack;
