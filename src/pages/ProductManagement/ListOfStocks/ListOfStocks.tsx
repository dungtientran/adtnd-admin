import type { FC } from 'react';

import { Space, Tag } from 'antd';

import MyButton from '@/components/basic/button';
import MyTable from '@/components/core/table';

const { Column, ColumnGroup } = MyTable;

interface ColumnType {
  stock_code: string;
  mart: string;
  name_vi: string;
  name_en: string;
  sorter?: () => void;
}

const data: ColumnType[] = [
  {
    stock_code: '1',
    mart: 'HOSE',
    name_en: 'Company',
    name_vi: 'Công ty',
  },
];

new Array(100).fill(undefined).forEach((item, index) => {
  data.push({
    stock_code: index + 2 + '',
    mart: 'Hose' + index,
    name_vi: 'Công ty' + index,
    name_en: 'Company' + index,
  });
});

const ListOfStocks = () => {
  return (
    <div className="aaa">
      <h1>KKAKAKAKAKA</h1>
      <MyTable<ColumnType> dataSource={data} rowKey={record => record.stock_code} height="100%">
        <Column title="Thị trường" dataIndex="mart" key="mart" />
        <Column title="Mã chứng khoán" dataIndex="stock_code" key="stock_code" />
        <ColumnGroup title="Tên công ty">
          <Column title="Tên tiếng Việt" dataIndex="name_vi" key="name_vi" />
          <Column title="Tên tiếng Anh" dataIndex="name_en" key="name_en" />
        </ColumnGroup>
        <Column
          title="Logo"
          key="logo"
          render={(text, record: any) => (
            <Space size="middle">
              {/* <MyButton type="text">Invite {record.lastName}</MyButton> */}
              <MyButton type="primary">+</MyButton>
            </Space>
          )}
        />
      </MyTable>
    </div>
  );
};

export default ListOfStocks;
