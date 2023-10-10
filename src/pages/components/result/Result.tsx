import { Typography } from 'antd';

const { Text } = Typography;

interface IResult {
  searchText?: string;
  total?: number;
}

const Result: React.FC<IResult> = ({ searchText, total }) => {
  return (
    <div style={{ marginBottom: '10px', height: '22px' }}>
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
  );
};

export default Result;
