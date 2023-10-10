import { Button, InputNumber, Select, Space, Typography } from 'antd';
import { Fragment, useState } from 'react';

const { Text } = Typography;
const { Option } = Select;
const selectBefore = (
  <Select defaultValue="min" style={{ width: 100 }}>
    <Option value="min">Ít hơn</Option>
    <Option value="max">Lớn hơn</Option>
  </Select>
);

const BoxFilterListCustomer = () => {
  const [daysRemaining, setDaysRemaining] = useState<number | string>(0);

  const handleDaysRemaining = (day: number | string) => {
    setDaysRemaining(day);
  };

  return (
    <Space direction="vertical" size={'middle'} style={{ marginBottom: '20px', padding: '1rem', border: '1px solid #ccc', borderRadius: '6px'}}>
      <Space >
        <Text strong>Lọc theo Nav:</Text>
        <Space>
        <InputNumber
          addonBefore={<Text>Từ</Text>}
          // onChange={(value: any) => {
          //   setPriceRangeFilter({
          //     ...priceRangeFilter,
          //     from: value,
          //   });
          // }}
          style={{ width: '120px' }}
        />

        <InputNumber
          addonBefore={<Text>Đến</Text>}
          // onChange={(value: any) => {
          //   setPriceRangeFilter({
          //     ...priceRangeFilter,
          //     to: value,
          //   });
          // }}
          style={{ width: '120px' }}
        />
        </Space>
      </Space>

      <Space >
        <Text strong>Thời gian còn lại:</Text>
        <InputNumber
          addonBefore={selectBefore}
          addonAfter={<Text>Ngày</Text>}
          value={daysRemaining}
          onChange={value => setDaysRemaining(value as number)}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
          // parser={value => value!.replace(/\$\s?|(,*)/g, '')}
          min={0}
          style={{ width: '246px' }}
        />
      </Space>
      <Button>Lọc</Button>
    </Space>
  );
};

export default BoxFilterListCustomer;
