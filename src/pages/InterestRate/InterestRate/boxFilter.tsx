import type { RadioChangeEvent } from 'antd';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';

import { Button, DatePicker, InputNumber, Radio, Select, Space, Typography } from 'antd';
import qs from 'qs';
import React, { Fragment, useEffect, useState } from 'react';

const { RangePicker } = DatePicker;
const { Text } = Typography;
const { Option } = Select;

interface IBoxFilter {
  setQueryFilter: (query: string) => void;
}

const BoxFilter = ({ setQueryFilter }: IBoxFilter) => {
  const [queryObj, setQueryObj] = useState({});

  const onChange = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    // console.log('Formatted Selected Time: ', dateString);
    setQueryObj(prev => ({
      ...prev,
      start_date: dateString[0],
      end_date: dateString[1],
    }));
  };

  const handleSelectIsContact = (e: RadioChangeEvent) => {
    const status = e.target.value;

    setQueryObj(prev => ({
      ...prev,
      status,
    }));
  };

  // console.log('queryObj_______________', queryObj);

  useEffect(() => {
    // console.log(queryObj);
    const querystring = qs.stringify(queryObj);

    // console.log('querystring_______________', querystring);
    setQueryFilter(querystring);
  }, [queryObj]);

  return (
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
      <Space size="large">
        <Space style={{ width: '100%' }} direction="vertical">
          <Text strong>Giá trị ban đầu:</Text>
          <Space direction="vertical">
            <InputNumber
              addonBefore={
                <div style={{ width: '30px' }}>
                  <Text>Từ</Text>
                </div>
              }
              onChange={value =>
                setQueryObj(prev => ({
                  ...prev,
                  initial_value_from: value,
                }))
              }
              style={{ width: '320px' }}
              min={0}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />

            <InputNumber
              addonBefore={
                <div style={{ width: '30px' }}>
                  <Text>Đến</Text>
                </div>
              }
              onChange={value =>
                setQueryObj(prev => ({
                  ...prev,
                  initial_value_to: value,
                }))
              }
              style={{ width: '320px' }}
              min={0}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Space>
        </Space>
        <Space direction="vertical">
          <Text strong>Lợi nhuận dự kiến:</Text>
          <Space direction="vertical">
            <InputNumber
              addonBefore={
                <div style={{ width: '30px' }}>
                  <Text>Từ</Text>
                </div>
              }
              onChange={value =>
                setQueryObj(prev => ({
                  ...prev,
                  expected_end_value_from: value,
                }))
              }
              style={{ width: '320px' }}
              min={0}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />

            <InputNumber
              addonBefore={
                <div style={{ width: '30px' }}>
                  <Text>Đến</Text>
                </div>
              }
              onChange={value =>
                setQueryObj(prev => ({
                  ...prev,
                  expected_end_value_to: value,
                }))
              }
              style={{ width: '320px' }}
              min={0}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Space>
        </Space>
        <Space direction="vertical">
          <Text strong>Hoa hồng tạm tính:</Text>
          <Space direction="vertical">
            <InputNumber
              addonBefore={
                <div style={{ width: '30px' }}>
                  <Text>Từ</Text>
                </div>
              }
              // onChange={value => setNav_Low(value as number)}
              style={{ width: '320px' }}
              min={0}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
            <InputNumber
              addonBefore={
                <div style={{ width: '30px' }}>
                  <Text>Đến</Text>
                </div>
              }
              // onChange={value => setNav_Hight(value as number)}
              style={{ width: '320px' }}
              min={0}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Space>
        </Space>
      </Space>

      <Space direction="vertical">
        <Text strong>Tình trạng: </Text>
        <Radio.Group defaultValue={''} onChange={handleSelectIsContact}>
          <Radio.Button value="">Tất cả</Radio.Button>
          <Radio.Button value="active">Đang có hiệu lực</Radio.Button>
          <Radio.Button value="inactive">Đã thanh lý</Radio.Button>
        </Radio.Group>
      </Space>
    </Space>
  );
};

export default BoxFilter;
