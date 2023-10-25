import type { RadioChangeEvent } from 'antd';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';

import { Button, DatePicker, Radio, Select, Space, Typography } from 'antd';
import qs from 'qs';
import { useEffect, useState } from 'react';

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface IBoxFilter {
  setQueryFilter: (query: string) => void;
  setSearchText: (obj: object) => void;
}

const BoxFilter = ({ setQueryFilter, setSearchText }: IBoxFilter) => {
  const [selectedDates, setSelectedDates] = useState<any>(null);
  const [queryObj, setQueryObj] = useState({
    start_date: '',
    end_date: '',
    is_contact: null,
  });

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
    setSelectedDates(value);
  };

  const handleSelectIsContact = (e: RadioChangeEvent) => {
    const is_contact = e.target.value;

    setQueryObj(prev => ({
      ...prev,
      is_contact,
    }));
  };

  // console.log('queryObj_______________', queryObj);

  const handleSetQueryString = () => {
    const querystring = qs.stringify(queryObj);

    setQueryFilter(querystring);
  };

  const handleResetFilter = () => {
    setQueryFilter('');
    setQueryObj({
      start_date: '',
      end_date: '',
      is_contact: null,
    });
    setSelectedDates(null);
    setSearchText({})
  };

  return (
    <Space
      direction="vertical"
      size="middle"
      style={{ marginBottom: '20px', padding: '1rem', border: '1px solid #ccc', borderRadius: '6px' }}
    >
      <Space size="middle">
        <Space direction="vertical">
          <Text strong>Lọc theo ngày yêu cầu:</Text>
          <Space>
            <RangePicker format="YYYY/MM/DD" value={selectedDates} onChange={onChange} />
          </Space>
        </Space>

        <Space direction="vertical">
          <Text strong>Tình trạng liên hệ: </Text>
          <Radio.Group value={queryObj.is_contact} onChange={handleSelectIsContact}>
            <Radio.Button value={null}>Tất cả</Radio.Button>
            <Radio.Button value={true}>Đã liên hệ</Radio.Button>
            <Radio.Button value={false}>Chưa liên hệ</Radio.Button>
          </Radio.Group>
        </Space>
      </Space>

      <Space>
        <Button onClick={handleSetQueryString}>Lọc</Button>
        <Button onClick={handleResetFilter}>Reset bộ lọc</Button>
      </Space>
    </Space>
  );
};

export default BoxFilter;
