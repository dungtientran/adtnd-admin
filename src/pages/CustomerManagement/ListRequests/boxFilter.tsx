import { Button, DatePicker, InputNumber, Radio, Select, Space, Typography } from 'antd';
import React, { Fragment, useState } from 'react';

const { RangePicker } = DatePicker;
const { Text } = Typography;
const { Option } = Select;
const selectBefore = (
  <Select defaultValue="min" style={{ width: 100 }}>
    <Option value="min">Ít hơn</Option>
    <Option value="max">Lớn hơn</Option>
  </Select>
);

const BoxFilter = () => {
  return (
    <Space
      direction="vertical"
      size={'middle'}
      style={{ marginBottom: '20px', padding: '1rem', border: '1px solid #ccc', borderRadius: '6px' }}
    >
      <Space>
        <Text strong>Lọc theo ngày yêu cầu:</Text>
        <Space>
          <RangePicker />
        </Space>
      </Space>

      <Space>
        <Text strong>Tình trạng liên hệ: </Text>
        <Radio.Group defaultValue={''} >
                    <Radio.Button value={''}>Tất cả</Radio.Button>
                    <Radio.Button value={true}>Đã liên hệ</Radio.Button>
                    <Radio.Button value={false}>Chưa liên hệ</Radio.Button>
                  </Radio.Group>
      </Space>
      <Button>Lọc</Button>
    </Space>
  );
};

export default BoxFilter;
