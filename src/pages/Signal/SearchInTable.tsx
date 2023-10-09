import { MenuOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import { useState } from 'react';

export const getColumnSearchProps = ({ setFilter }: any) => {
  const [value, setValue] = useState('');

  return {
    filterDropdown: () => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <Input
          placeholder={`Search name`}
          value={value}
          onChange={e => {
            setValue(e.target.value);
          }}
          onPressEnter={() => {
            console.log(value);
            setFilter(value);
          }}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setFilter(value);
            }}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              setFilter('');
              setValue('');
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
  };
};
