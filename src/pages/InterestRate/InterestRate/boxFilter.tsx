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
    const is_contact = e.target.value;

    setQueryObj(prev => ({
      ...prev,
      is_contact,
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
      style={{ marginBottom: '20px', padding: '1rem', border: '1px solid #ccc', borderRadius: '6px' }}
    >
      <Space>
        <Text strong>Giá trị ban đầu:</Text>
        <Space>
          <InputNumber
            addonBefore={<Text>Từ</Text>}
            // onChange={value => setNav_Low(value as number)}
            style={{ width: '120px' }}
            min={0}
          />

          <InputNumber
            addonBefore={<Text>Đến</Text>}
            // onChange={value => setNav_Hight(value as number)}
            style={{ width: '120px' }}
            min={0}
          />
        </Space>
      </Space>
      <Space>
        <Text strong>Lợi nhuận dự kiến:</Text>
        <Space>
          <InputNumber
            addonBefore={<Text>Từ</Text>}
            // onChange={value => setNav_Low(value as number)}
            style={{ width: '120px' }}
            min={0}
          />

          <InputNumber
            addonBefore={<Text>Đến</Text>}
            // onChange={value => setNav_Hight(value as number)}
            style={{ width: '120px' }}
            min={0}
          />
        </Space>
      </Space>
      <Space>
        <Text strong>Hoa hồng tạm tính:</Text>
        <Space>
          <InputNumber
            addonBefore={<Text>Từ</Text>}
            // onChange={value => setNav_Low(value as number)}
            style={{ width: '120px' }}
            min={0}
          />

          <InputNumber
            addonBefore={<Text>Đến</Text>}
            // onChange={value => setNav_Hight(value as number)}
            style={{ width: '120px' }}
            min={0}
          />
        </Space>
      </Space>

      <Space>
        <Text strong>Tình trạng: </Text>
        <Radio.Group defaultValue={''} onChange={handleSelectIsContact}>
          <Radio.Button value="">Tất cả</Radio.Button>
          <Radio.Button value={true}>Đang có hiệu lực</Radio.Button>
          <Radio.Button value={false}>Đã thanh lý</Radio.Button>
        </Radio.Group>
      </Space>
    </Space>
  );
};

export default BoxFilter;
