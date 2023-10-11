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
      direction="vertical"
      size="middle"
      style={{ marginBottom: '20px', padding: '1rem', border: '1px solid #ccc', borderRadius: '6px' }}
    >
      <Text strong>Lọc theo:</Text>

      <Space>
        <Text strong>Ngày giao dịch:</Text>
        <Space>
          <RangePicker format="YYYY/MM/DD" onChange={onChange} />
        </Space>
      </Space>

      <Space>
        <Text strong>Số tiền giao dịch: </Text>
        <Space>
          <InputNumber
            addonBefore={<Text>Từ</Text>}
            onChange={value =>
              setQueryObj(prev => ({
                ...prev,
                amount_min: value,
              }))
            }
            style={{ width: '120px' }}
            min={0}
          />

          <InputNumber
            addonBefore={<Text>Đến</Text>}
            onChange={value =>
              setQueryObj(prev => ({
                ...prev,
                amount_max: value,
              }))
            }
            style={{ width: '120px' }}
            min={0}
          />
        </Space>
      </Space>
    </Space>
  );
};

export default BoxFilter;
