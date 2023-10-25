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
  handleSetPageOnFilter: () => void;
}

const BoxFilter = ({ setQueryFilter, handelResetFilter, handleSetPageOnFilter }: IBoxFilter) => {
  const [queryObj, setQueryObj] = useState<any>({
    start_date: '',
    end_date: '',
    initial_value_from: '',
    initial_value_to: '',
    profit_percent_from: '',
    profit_percent_to: '',
    fila_commission_from: '',
    fila_commission_to: '',
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

  const handleResetFilter = () => {
    setQueryObj(undefined);
    // console.log(123456);
    setStatusContract('');
    handelResetFilter();
    setSelectedDates(null);
  };

  const handleFilter = () => {
    const querystring = qs.stringify(queryObj);

    setQueryFilter(querystring);
    handleSetPageOnFilter();
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
        marginTop: '10px',
      }}
    >
      <Space>
        {/* <Text strong>Tình trạng: </Text>
        <Radio.Group value={statusContrac} onChange={handleSelectIsContact}>
          <Radio.Button value="">Tất cả</Radio.Button>
          <Radio.Button value="active">Đang có hiệu lực</Radio.Button>
          <Radio.Button value="inactive">Đã thanh lý</Radio.Button>
        </Radio.Group> */}
      </Space>
      <Space>
        <div style={{ width: '130px' }}>
          <Text strong>Ngày Hiệu lực:</Text>
        </div>
        <Space>
          <RangePicker style={{ width: '328px' }} format="YYYY/MM/DD" onChange={onChange} value={selectedDates} />
        </Space>
      </Space>
      <Space direction="vertical" size="middle">
        <Space style={{ width: '100%' }}>
          <div style={{ width: '130px' }}>
            <Text strong>Giá trị ban đầu:</Text>
          </div>
          <Space>
            <InputNumber
              addonBefore={<Text>Từ</Text>}
              onChange={value =>
                setQueryObj((prev: any) => ({
                  ...prev,
                  initial_value_from: value,
                }))
              }
              style={{ width: '160px' }}
              min={0}
              value={queryObj?.initial_value_from}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />

            <InputNumber
              addonBefore={<Text>Đến</Text>}
              onChange={value =>
                setQueryObj((prev: any) => ({
                  ...prev,
                  initial_value_to: value,
                }))
              }
              style={{ width: '160px' }}
              min={0}
              value={queryObj?.initial_value_to}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Space>
        </Space>
        <Space>
          <div style={{ width: '130px' }}>
            <Text strong>Lợi nhuận dự kiến:</Text>
          </div>
          <Space>
            <InputNumber
              addonBefore={<Text>Từ</Text>}
              onChange={value =>
                setQueryObj((prev: any) => ({
                  ...prev,
                  profit_percent_from: value,
                }))
              }
              style={{ width: '160px' }}
              min={0}
              value={queryObj?.profit_percent_from}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />

            <InputNumber
              addonBefore={<Text>Đến</Text>}
              onChange={value =>
                setQueryObj((prev: any) => ({
                  ...prev,
                  profit_percent_to: value,
                }))
              }
              value={queryObj?.profit_percent_to}
              style={{ width: '160px' }}
              min={0}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Space>
        </Space>
        {/* <Space>
          <div style={{ width: '130px' }}>
            <Text strong>Hoa hồng tạm tính (Fila): </Text>
          </div>
          <Space>
            <InputNumber
              addonBefore={<Text>Từ</Text>}
              value={queryObj?.fila_commission_from}
              onChange={value =>
                setQueryObj((prev: any) => ({
                  ...prev,
                  fila_commission_from: value,
                }))
              }
              style={{ width: '160px' }}
              min={0}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
            <InputNumber
              addonBefore={<Text>Đến</Text>}
              value={queryObj?.fila_commission_to}
              onChange={value =>
                setQueryObj((prev: any) => ({
                  ...prev,
                  fila_commission_to: value,
                }))
              }              style={{ width: '160px' }}
              min={0}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Space>
        </Space> */}
      </Space>
      <Space>
        <Button onClick={handleFilter}>Lọc</Button>
        <Button onClick={handleResetFilter}>Reset bộ lọc</Button>
      </Space>
    </Space>
  );
};

export default BoxFilter;
