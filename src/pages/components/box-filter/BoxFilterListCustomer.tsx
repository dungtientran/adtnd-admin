/* eslint-disable prettier/prettier */
import type { TableParams } from '@/pages/CustomerManagement/ListCustomers/index.interface';
import type { Dispatch, SetStateAction} from 'react';

import { Button, InputNumber, Radio, Select, Space, Typography } from 'antd';
import qs from 'qs';
import { useState } from 'react';

const { Text } = Typography;
const { Option } = Select;

interface IBoxFilterListCustomer {
  setQueryFiter: (query: string) => void;
  clearFilter: () => void;
  setTableParams:  Dispatch<SetStateAction<TableParams>>
}

const BoxFilterListCustomer = ({ setQueryFiter, clearFilter,setTableParams }: IBoxFilterListCustomer) => {
  const [daysRemaining, setDaysRemaining] = useState<number | undefined>(undefined);
  const [day_remaining_type, setDay_remaining_type] = useState<string >('less');
  const [nav_low, setNav_Low] = useState<number | undefined>(undefined);
  const [nav_Hight, setNav_Hight] = useState<number | undefined>(undefined);
  const [careby, setCareby] = useState<string>('');
  const selectBefore = (
    <Select value={day_remaining_type} style={{ width: 100 }} onChange={value => setDay_remaining_type(value as string)}>
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
      careby: careby
    };

    setQueryFiter(qs.stringify(queryFilter));
    setTableParams({
      pagination: {
        current: 1
      }
    })
  };


  return (
    <Space
      direction="vertical"
      size={'middle'}
      style={{ margin: '20px 0', padding: '1rem', border: '1px solid #ccc', borderRadius: '6px' }}
    >
      <Space direction="vertical">
        <Space>
          <div style={{width: '130px'}}>

          <Text strong>Lọc theo Nav:</Text>
          </div>
          <Space style={{ width: '100%' }}>
            <InputNumber
              addonBefore={
                <div style={{ width: '30px' }}>
                  <Text>Từ {''}</Text>
                </div>
              }
              onChange={value => setNav_Low(value as number)}
              style={{ width: '180px' }}
              min={0}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              value={nav_low}
            />

            <InputNumber
              addonBefore={
                <div style={{ width: '30px' }}>
                  <Text>Đến</Text>
                </div>
              }
              onChange={value => setNav_Hight(value as number)}
              style={{ width: '180px' }}
              min={0}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              value={nav_Hight}
            />
          </Space>
        </Space>
      </Space>
      <Space>
      <div style={{width: '130px'}}>

        <Text strong>Thời gian còn lại:</Text>
</div>
        <InputNumber
          addonBefore={selectBefore}
          addonAfter={<Text>Ngày</Text>}
          value={daysRemaining}
          onChange={value => setDaysRemaining(value as number)}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          // parser={value => value!.replace(/\$\s?|(,*)/g, '')}
          min={0}
          style={{ width: '246px' }}
          
        />
        {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
        </div> */}
      </Space>
      <Space>
      <div style={{width: '130px'}}>

        <Text strong>Nhân viên chăm sóc: </Text>
</div>
        <Radio.Group
          value={careby}
          onChange={(e) => setCareby(e.target.value)}
        >
          <Radio.Button value="">Tất cả</Radio.Button>
          <Radio.Button value="have">Đã có</Radio.Button>
          <Radio.Button value="no_have">Chưa có</Radio.Button>
        </Radio.Group>
      </Space>
      <Space>
        <Button onClick={handleFilter}>Lọc</Button>
        <Button onClick={() => {
          clearFilter();
          setNav_Low(undefined);
          setNav_Hight(undefined);
          setDaysRemaining(undefined);
          setDay_remaining_type('less');
          setCareby('')
        }}>
          Reset bộ lọc
          </Button> 
      </Space>
    </Space>
  );
};

export default BoxFilterListCustomer;
