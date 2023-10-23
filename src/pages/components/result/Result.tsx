import { Typography } from 'antd';

import ExportExcel from '../button-export-excel/ExportExcel';

const { Text } = Typography;

interface IResult {
  searchText?: string;
  total?: number;
  columns?: any;
  dataSource?: any;
  isButtonExcel?: boolean;
  title?: string;
}

const Result: React.FC<IResult> = ({ searchText, total, columns, dataSource, isButtonExcel = true , title}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '10px 0' }}>
      <div style={{ height: '22px' }}>
        {total ? (
          <Text>
            Có tất cả <Text strong>{total?.toLocaleString()}</Text> kết quả
            {searchText && (
              <Typography.Text>
                {' '}
                tìm kiếm cho <Text strong>{searchText}</Text>
              </Typography.Text>
            )}
          </Text>
        ) : (
          ''
        )}
      </div>
      {isButtonExcel && <ExportExcel columns={columns} dataSource={dataSource} title={title} />}
    </div>
  );
};

export default Result;
