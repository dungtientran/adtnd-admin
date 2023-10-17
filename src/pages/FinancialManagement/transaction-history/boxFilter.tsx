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

  useEffect(() => {
    const querystring = qs.stringify(queryObj);

    setQueryFilter(querystring);
  }, [queryObj]);

  return (
    <Space
      direction="horizontal"
      size="large"
      style={{
        marginBottom: '20px',
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '6px',
        alignItems: 'start',
      }}
    >
      {/* <Text strong>Lọc theo:</Text> */}

      <Space direction="vertical">
        <Text strong>Ngày giao dịch:</Text>
        <Space>
          <RangePicker format="YYYY/MM/DD" onChange={onChange} />
        </Space>
      </Space>

      <Space direction="vertical">
        <Text strong>Số tiền giao dịch: </Text>
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
                amount_min: value,
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
                amount_max: value,
              }))
            }
            style={{ width: '320px' }}
            min={0}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </Space>
      </Space>
    </Space>
  );
};

export default BoxFilter;
