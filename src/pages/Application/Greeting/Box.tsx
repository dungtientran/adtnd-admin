import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Col, Input, Row, Space, Typography } from 'antd';
import React, { useRef, useState } from 'react';

const { Title, Text } = Typography;

interface IBoxGreeting {
  title: string;
  descriptions: string;
}

const BoxGreeting: React.FC<IBoxGreeting> = ({ descriptions, title }) => {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);

  const handleEditClick = () => {
    setIsEditing(true);

    if (textareaRef.current) {
      const textarea = textareaRef.current as any;

      textarea.focus();
      textarea.setSelectionRange(descriptions.length, descriptions.length); // Đặt con trỏ cuối văn bản
    }
  };

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
              <Button type="primary">
                <SaveOutlined />
              </Button>
            )
          }
        >
          {isEditing ? (
            <Input.TextArea
              ref={textareaRef}
              autoFocus
              onBlur={() => setIsEditing(false)}
              defaultValue={descriptions}
              size="middle"
              style={{ fontSize: '24px' }}
            />
          ) : (
            <Title level={3}>{descriptions}</Title>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default BoxGreeting;
