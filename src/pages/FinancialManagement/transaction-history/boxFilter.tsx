import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';

import { Button, DatePicker, InputNumber, Space, Typography } from 'antd';
import qs from 'qs';
import { useState } from 'react';

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface IBoxFilter {
  setQueryFilter: (query: string) => void;
  handleSetPageOnFilter: () => void;
  handleResetFilters: () => void;
}

const BoxFilter = ({ setQueryFilter, handleSetPageOnFilter, handleResetFilters }: IBoxFilter) => {
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [queryObj, setQueryObj] = useState<{
    start_date: string;
    end_date: string;
    amount_min: string | number;
    amount_max: string | number;
  }>({
    start_date: '',
    end_date: '',
    amount_min: '',
    amount_max: '',
  });

  const onChange = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    // console.log('Formatted Selected Time: ', dateString);
    setSelectedDate(value);
    setQueryObj(prev => ({
      ...prev,
      start_date: dateString[0],
      end_date: dateString[1],
    }));
  };

  const handleFilter = () => {
    handleSetPageOnFilter();
    const querystring = qs.stringify(queryObj);

    setQueryFilter(querystring);
  };

  const handleResetFilter = () => {
    handleSetPageOnFilter();
    handleResetFilters();
    setQueryFilter('');
    setQueryObj({
      start_date: '',
      end_date: '',
      amount_min: '',
      amount_max: '',
    });
    setSelectedDate(null);
  };

  return (
    <Space
      direction="vertical"
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

      <Space>
        <div style={{ width: '120px' }}>
          <Text strong>Ngày giao dịch:</Text>
        </div>
        <Space>
          <RangePicker format="YYYY/MM/DD" onChange={onChange} value={selectedDate} style={{ width: '328px' }} />
        </Space>
      </Space>

      <Space>
        <div style={{ width: '120px' }}>
          <Text strong>Số tiền giao dịch: </Text>
        </div>
        <Space>
          <InputNumber
            addonBefore={<Text>Từ</Text>}
            value={queryObj?.amount_min}
            onChange={value =>
              setQueryObj(prev => ({
                ...prev,
                amount_min: value as string,
              }))
            }
            style={{ width: '160px' }}
            min={0}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />

          <InputNumber
            addonBefore={<Text>Đến</Text>}
            value={queryObj?.amount_max}
            onChange={value =>
              setQueryObj(prev => ({
                ...prev,
                amount_max: value as string,
              }))
            }
            style={{ width: '160px' }}
            min={0}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </Space>
      </Space>

      <Space>
        <Button onClick={handleFilter}>Lọc</Button>
        <Button onClick={handleResetFilter}>Reset bộ lọc</Button>
      </Space>
    </Space>
  );
};

export default BoxFilter;
