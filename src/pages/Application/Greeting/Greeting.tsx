import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

import HeadTitle from '@/pages/components/head-title/HeadTitle';

const { Title, Text } = Typography;

import { Button, Card, Col, InputNumber, Row, Space, Typography } from 'antd';

import BoxGreeting from './Box';

const Greeting = () => {
  const [days, setDays] = useState<number | null>(null);

  const handleSetDays = (value: number) => {};

  return (
    <div className="aaa">
      <HeadTitle title="Thiết lập câu chào" />
      <div style={{ marginTop: '40px' }}>
        <BoxGreeting title="Nội dung câu chào" descriptions="Nhận các ý tưởng đầu tư cùng công cụ quản trị FiSafe!" />
        <BoxGreeting title="Nội dung câu chào phụ" descriptions="Đăng ký trải nghiệm 30 ngày dùng thử" />
        <Row justify="center" style={{ marginTop: '20px' }}>
          <Col span={20}>
            <Card
              title={'Thiết lập số ngày dùng thử'}
              bordered={false}
              extra={
                days && (
                  <Button type="primary">
                    <SaveOutlined />
                  </Button>
                )
              }
            >
              <InputNumber
                min={0}
                style={{ width: '200px' }}
                value={days}
                onChange={value => setDays(value as number)}
                placeholder="Nhập số ngày"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Greeting;
