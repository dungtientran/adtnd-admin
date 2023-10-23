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
  handelResetFilter: () => void;
}

const BoxFilter = ({ setQueryFilter, handelResetFilter }: IBoxFilter) => {
  const [queryObj, setQueryObj] = useState<any>({
    start_date: '',
    end_date: '',
    initial_value_from: '',
    initial_value_to: '',
    profit_percent_from: '',
    profit_percent_to: '',
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

  // const handleResetFilter = () => {
  //   setQueryObj(undefined);
  //   // console.log(123456);
  //   setStatusContract('');
  //   handelResetFilter();
  //   setSelectedDates(null);
  // };

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
        marginBottom: '20px',
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '6px',
        marginTop: '10px',
      }}
    >
      <Space>
        <Text strong>Tình trạng: </Text>
        <Radio.Group
        //  value={statusContrac}
         >
          <Radio.Button value="">Tất cả</Radio.Button>
          <Radio.Button value="active">Đang có hiệu lực</Radio.Button>
          <Radio.Button value="inactive">Đã thanh lý</Radio.Button>
        </Radio.Group>
      </Space>
      <Button 
      // onClick={handleResetFilter}
      >
        Reset bộ lọc</Button>
    </Space>
  );
};

export default BoxFilter;
