import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';

import { Button, DatePicker, Radio, Select, Space, Typography } from 'antd';
import qs from 'qs';
import React, { useEffect, useState } from 'react';

const { RangePicker } = DatePicker;
const { Text } = Typography;
const { Option } = Select;

interface IBoxFilter {
  setQueryFilter: (query: string) => void;
}

const BoxFilter = ({ setQueryFilter }: IBoxFilter) => {
  const [queryObj, setQueryObj] = useState<any>({
    status: '',
  });
  const [statusContrac, setStatusContract] = useState<string>('');
  const [selectedDates, setSelectedDates] = useState<any>(null);

  const onChange = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    // console.log('Formatted Selected Time: ', dateString);
    setSelectedDates(value);
    setQueryObj((prev: any) => ({
      ...prev,
      start_date: dateString[0],
      end_date: dateString[1],
    }));
  };

  // const handleSelectIsContact = (e: RadioChangeEvent) => {
  //   setStatusContract(e.target.value);
  //   setQueryObj(prev => ({
  //     ...prev,
  //     status: statusContrac,
  //   }));
  // };

  // console.log('queryObj_______________', queryObj);

  const onChangeSelectedMonth: DatePickerProps['onChange'] = (date, dateString) => {
    console.log('ádddddddddđ', dateString);
  };

  const handleResetFilter = () => {
    setQueryObj(undefined);
    // console.log(123456);
    setStatusContract('');
    setSelectedDates(null);
  };

  const handleFilter = () => {
    const querystring = qs.stringify(queryObj);

    setQueryFilter(querystring);
  };

  // useEffect(() => {
  //   if (queryObj) {
  //     // console.log(queryObj);
  //     const querystring = qs.stringify(queryObj);

  //     // console.log('querystring_______________', querystring);
  //     setQueryFilter(querystring);
  //   } else {
  //     setQueryFilter('');
  //   }
  // }, [queryObj]);

  // console.log(queryObj);

  return (
    <Space
      direction="vertical"
      size="middle"
      style={{
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '6px',
        margin: '10px 0',
      }}
    >
      <Space>
        <div style={{ width: '100px' }}>
          <Text strong>Tình trạng: </Text>
        </div>
        <Radio.Group
          value={queryObj?.status}
          onChange={e =>
            setQueryObj({
              status: e.target.value,
            })
          }
        >
          <Radio.Button value="">Tất cả</Radio.Button>
          <Radio.Button value="approve">Đã duyệt</Radio.Button>
          <Radio.Button value="pending">Chưa duyệt</Radio.Button>
        </Radio.Group>
      </Space>
      <Space>
        <div style={{ width: '100px' }}>
          <Text strong>Kỳ thanh toán:</Text>
        </div>
        <DatePicker onChange={onChangeSelectedMonth} picker="month" />
      </Space>
      <Space>
        <Button onClick={handleFilter}>Lọc</Button>
        <Button onClick={handleResetFilter}>Reset bộ lọc</Button>
      </Space>
    </Space>
  );
};

export default BoxFilter;
