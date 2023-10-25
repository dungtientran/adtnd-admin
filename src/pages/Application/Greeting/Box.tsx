import type { IGreeting } from './Greeting';
import type { UseMutationResult } from '@tanstack/react-query';

import './index.less';

import { EditOutlined, RollbackOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Col, Input, InputNumber, Popconfirm, Row, Space, Spin, Typography } from 'antd';
import React, { Fragment, useEffect, useRef, useState } from 'react';

const { Title, Text } = Typography;

interface IBoxGreeting {
  title: string;
  descriptions: string | number | null;
  useUpdateGreeting: () => UseMutationResult<any, unknown, any, unknown>;
  keySelected: string;
  data: IGreeting;
}

const BoxGreeting: React.FC<IBoxGreeting> = ({ descriptions, title, useUpdateGreeting, data, keySelected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [dataEdit, setDataEdit] = useState<IGreeting>(data);
  const textareaRef = useRef(null);
  const updateDataMutation = useUpdateGreeting();

  const handleUpdate = (newData: any) => {
    updateDataMutation.mutate(newData);
  };

  const handleOnchane = (value: any) => {
    setDataEdit(prev => ({
      ...prev,
      [keySelected]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);

    if (textareaRef.current) {
      const textarea = textareaRef.current as any;

      textarea.focus();
      // textarea.setSelectionRange(descriptions.length, descriptions.length); // Đặt con trỏ cuối văn bản
    }
  };

  useEffect(() => {
    setDataEdit(data);
    setIsEditing(false);
  }, [data]);
  // console.log('Data_________________', data);
  // console.log('dataEdit__________________', dataEdit);
  // console.log('isEdit___________________', isEdit);
  console.log('isEditing____________________', isEditing);

  return (
    <Row justify="center" style={{ marginTop: '20px' }}>
      <Col span={20}>
        <Card
          title={title}
          bordered={false}
          extra={
            !isEditing ? (
              <Button type="primary" onClick={handleEditClick}>
                <EditOutlined />
              </Button>
            ) : (
              <Space>
                <Popconfirm title="Chắc chắn?" onConfirm={() => handleUpdate(dataEdit)}>
                  <Spin spinning={updateDataMutation.isLoading}>
                    <Button type="primary">
                      <SaveOutlined />
                    </Button>
                  </Spin>
                </Popconfirm>
                <Button onClick={() => setIsEditing(false)}>
                  <RollbackOutlined />
                </Button>
              </Space>
            )
          }
        >
          {isEditing ? (
            <Fragment>
              {typeof descriptions === 'number' ? (
                <InputNumber
                  ref={textareaRef}
                  autoFocus
                  // onBlur={() => setIsEditing(false)}
                  defaultValue={descriptions as number}
                  className="greeting_input"
                  onChange={value => handleOnchane(value)}
                />
              ) : (
                <Input.TextArea
                  ref={textareaRef}
                  autoFocus
                  // onBlur={() => setIsEditing(false)}
                  defaultValue={descriptions as string}
                  size="middle"
                  className="greeting_input"
                  onChange={e => handleOnchane(e.target.value)}
                />
              )}
            </Fragment>
          ) : (
            <Title level={3}>{descriptions}</Title>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default BoxGreeting;
