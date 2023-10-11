import { Button, InputNumber, Select, Space, Typography } from 'antd';
import qs from 'qs';
import { Fragment, useEffect, useState } from 'react';

const { Text } = Typography;
const { Option } = Select;

interface IBoxFilterListCustomer {
  setQueryFiter: (query: string) => void;
}

const BoxFilterListCustomer = ({ setQueryFiter }: IBoxFilterListCustomer) => {
  const [daysRemaining, setDaysRemaining] = useState<number | undefined>(undefined);
  const [day_remaining_type, setDay_remaining_type] = useState<string | undefined>(undefined);
  const [nav_low, setNav_Low] = useState<number | undefined>(undefined);
  const [nav_Hight, setNav_Hight] = useState<number | undefined>(undefined);
  const selectBefore = (
    <Select defaultValue="less" style={{ width: 100 }} onChange={value => setDay_remaining_type(value as string)}>
      <Option value="less">Ít hơn</Option>
      <Option value="max">Lớn hơn</Option>
    </Select>
  );

  const handleFilter = () => {
      const queryFilter = {
        day_remaining: daysRemaining,
        day_remaining_type: day_remaining_type || 'less',
        nav_low: nav_low,
        nav_high: nav_Hight,
      };

      setQueryFiter(qs.stringify(queryFilter));
    
  };

  // useEffect(() => {
  //   if (nav_Hight && nav_low && nav_Hight <= nav_low) {
  //     setvalid(true);

  //     if (nav_low < 0) {
  //       setNav_Low(0);
  //     }
  //   } else {
  //     setvalid(false);
  //   } 
  // }, [nav_Hight, nav_low]);

  return (
    <Space
      direction="vertical"
      size={'middle'}
      style={{ marginBottom: '20px', padding: '1rem', border: '1px solid #ccc', borderRadius: '6px' }}
    >
      <Space direction="vertical">
        <Space>
          <Text strong>Lọc theo Nav:</Text>
          <Space>
            <InputNumber
              addonBefore={<Text>Từ</Text>}
              onChange={value => setNav_Low(value as number)}
              style={{ width: '120px' }}
              min={0}
            />

            <InputNumber
              addonBefore={<Text>Đến</Text>}
              onChange={value => setNav_Hight(value as number)}
              style={{ width: '120px' }}
              min={0}
            />
          </Space>
        </Space>
      </Space>

      <Space>
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
      <Button onClick={handleFilter}>Lọc</Button>
    </Space>
  );
};

export default BoxFilterListCustomer;
