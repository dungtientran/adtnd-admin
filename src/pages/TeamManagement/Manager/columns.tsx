import type { DataIndex, DataType } from './index.interface';
import type { UseMutationResult } from '@tanstack/react-query';
import type { InputRef } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { ColumnsType, FilterConfirmProps } from 'antd/es/table/interface';

import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm, Space, Typography } from 'antd';
import { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';

const { Text } = Typography;

export const ColumnSearchProps = (
  dataIndex: DataIndex,
  listCustomerSp: DataType[],
  setTotal: (total: number) => void,
): ColumnType<DataType> => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);

    if (selectedKeys[0]) {
      const filtered = listCustomerSp.filter(record =>
        record[dataIndex] ? record[dataIndex]?.toString().toLowerCase().includes(selectedKeys[0].toLowerCase()) : '',
      );

      setTotal(filtered.length);
    } else {
      setTotal(listCustomerSp.length);
    }
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  return {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record: any) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  };
};

export const Column = (
  listCustomerSp: DataType[],
  setTotal: (total: number) => void,
  useDirector: () => {
    create: UseMutationResult<any, any, any, unknown>;
    remove: UseMutationResult<any, any, any, unknown>;
  },
) => {
  const { remove } = useDirector();

  const handleRemove = (data: { parent_admin_id: string; child_admin_id: string }) => {
    remove.mutate(data);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Mã nhân viên Trưởng phòng',
      dataIndex: 'parent_staff_code',
      ...ColumnSearchProps('parent_staff_code', listCustomerSp, setTotal),
    },
    {
      title: 'Họ tên',
      dataIndex: 'parent_name',
      ...ColumnSearchProps('parent_name', listCustomerSp, setTotal),
    },
    {
      title: 'Mã nhân viên Sales',
      dataIndex: 'child_staff_code',
      ...ColumnSearchProps('child_staff_code', listCustomerSp, setTotal),
    },
    {
      title: 'Họ tên',
      dataIndex: 'child_name',
      ...ColumnSearchProps('child_name', listCustomerSp, setTotal),
    },
    {
      title: '',
      dataIndex: 'action',
      width: '8%',
      render: (_, record) => (
        <Space size="small">
          <Popconfirm
            title="Chắc chắn xóa"
            onConfirm={() => {
              handleRemove({
                child_admin_id: record?.child_id,
                parent_admin_id: record?.parent_id,
              });
            }}
          >
            <Button
              type="primary"
              size="small"
              // onClick={() => {
              //   setCustomerSelect(record);
              // }}
            >
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return columns;
};
